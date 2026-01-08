// AddEditSalaryGrade.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Grid,
    IconButton,
    Alert,
    Chip,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import {
    Save,
    Cancel,
    Add,
    Delete,
    ArrowUpward,
    ArrowDownward,
    ContentCopy,
    HelpOutline,
    AttachMoney,
    TrendingUp,
    Calculate
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import {
    ISalaryGrade,
    ISalaryGradeForm,
    ISalaryComponent,
    DEFAULT_COMPONENTS,
    calculateMonthlyGross,
    calculateTotalCTC,
    validateSalaryGrade,
    SalaryComponentForm
} from "./SalaryGradeTypes";

interface AddEditSalaryGradeProps {
    grade?: ISalaryGrade;
    mode: 'add' | 'edit';
    onSave: (data: ISalaryGradeForm) => Promise<void>;
}

const AddEditSalaryGrade: React.FC<AddEditSalaryGradeProps> = ({
    grade,
    mode = 'add',
    onSave
}) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [baseCTC, setBaseCTC] = useState(1000000); // Default 10 LPA for calculations

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isDirty }
    } = useForm<ISalaryGradeForm>({
        defaultValues: {
            name: '',
            code: '',
            description: '',
            components: [],
            isActive: true
        }
    });

    const { fields, append, remove, move, update } = useFieldArray({
        control,
        name: "components"
    });

    // Watch form values
    const watchComponents = watch("components");
    const watchName = watch("name");
    const watchCode = watch("code");

    // Load grade data in edit mode
    useEffect(() => {
        if (grade && mode === 'edit') {
            reset({
                name: grade.name,
                code: grade.code,
                description: grade.description || '',
                components: grade.components,
                isActive: grade.isActive
            });
        }
    }, [grade, mode, reset]);

    // Generate code from name
    const generateCode = () => {
        if (watchName && !watchCode) {
            const code = watchName
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .substring(0, 8);
            setValue('code', code);
        }
    };

    // Add default components
    const addDefaultComponents = () => {
        DEFAULT_COMPONENTS.forEach((component, index) => {
            append({
                name: component.name || '',
                calculationType: component.calculationType || 'Percentage',
                calculated: component.calculated || 'Monthly',
                value: component.value || 0,
                order: index + 1,
                isActive: component.isActive || true,
                description: component.description,
                appliesTo: component.appliesTo,
                conditions: component.conditions,
                taxExempt: component.taxExempt,
                maxLimit: component.maxLimit,
                minLimit: component.minLimit
            });
        });
    };

    // Add new component
    const addNewComponent = () => {
        append({
            name: '',
            calculationType: 'Percentage',
            calculated: 'Monthly',
            value: 0,
            order: fields.length + 1,
            isActive: true
        });
    };

    // Move component up/down
    const moveComponent = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index > 0) {
            move(index, index - 1);
            // Update order numbers
            fields.forEach((field, idx) => {
                update(idx, { ...field, order: idx + 1 });
            });
        } else if (direction === 'down' && index < fields.length - 1) {
            move(index, index + 1);
            // Update order numbers
            fields.forEach((field, idx) => {
                update(idx, { ...field, order: idx + 1 });
            });
        }
    };

    // Calculate component amount
    const calculateComponentAmount = (component: ISalaryComponent | SalaryComponentForm) => {
        if (!component.isActive) return 0;

        let amount = component.value;
        if (component.calculationType === 'Percentage') {
            amount = (baseCTC * component.value) / 100;
        }

        if (component.calculated === 'Annually') {
            return amount;
        } else {
            return amount; // Already monthly
        }
    };

    // Calculate totals
    const calculateTotals = () => {
        const monthlyTotal = calculateMonthlyGross(watchComponents || [], baseCTC);
        const annualTotal = calculateTotalCTC(watchComponents || [], baseCTC);

        return {
            monthlyTotal,
            annualTotal,
            monthlyBreakdown: watchComponents?.map(comp => ({
                ...comp,
                amount: calculateComponentAmount(comp as ISalaryComponent)
            })) || []
        };
    };

    const totals = calculateTotals();

    const onSubmit = async (data: ISalaryGradeForm) => {
        const validationErrors = validateSalaryGrade(data);
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => toast.error(error));
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(data);
            toast.success(mode === 'add' ? 'Salary grade created successfully!' : 'Salary grade updated successfully!');

            setTimeout(() => {
                router.push('/owner/grade');
            }, 1000);

        } catch (error) {
            console.error('Error saving salary grade:', error);
            toast.error('Failed to save salary grade');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (isDirty) {
            if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                router.push('/owner/grade');
            }
        } else {
            router.push('/owner/grade');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="app__slide-wrapper">
            {/* Breadcrumb */}
            <div className="breadcrumb__wrapper mb-[25px]">
                <nav>
                    <ol className="breadcrumb flex items-center mb-0">
                        <li className="breadcrumb-item">
                            <a href="/owner">Home</a>
                        </li>
                        <li className="breadcrumb-item">
                            <a href="/owner/grade">Salary Grades</a>
                        </li>
                        <li className="breadcrumb-item active">
                            {mode === 'add' ? 'Add New Salary Grade' : 'Edit Salary Grade'}
                        </li>
                    </ol>
                </nav>

                <div className="flex gap-2">
                    <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="!text-white"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Grade'}
                    </Button>
                </div>
            </div>

            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2
                    }}>
                        <AttachMoney sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                            {mode === 'add' ? 'Create New Salary Grade' : 'Edit Salary Grade'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Define salary structure with components and calculation rules
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                    {/* Left Column - Basic Info */}
                    <Grid item xs={12} md={5}>
                        <Paper elevation={0} sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 3,
                            mb: 3
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                Basic Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: 'Grade name is required' }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Salary Grade Name *"
                                                fullWidth
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message}
                                                onBlur={generateCode}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        name="code"
                                        control={control}
                                        rules={{ required: 'Grade code is required' }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Grade Code *"
                                                fullWidth
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message || 'Unique identifier for this grade'}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Description"
                                                fullWidth
                                                multiline
                                                rows={3}
                                                placeholder="Describe this salary grade and its purpose..."
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                                        <Box>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Base CTC for Calculations
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Used for percentage-based component calculations
                                            </Typography>
                                        </Box>
                                        <TextField
                                            type="number"
                                            value={baseCTC}
                                            onChange={(e) => setBaseCTC(Number(e.target.value))}
                                            size="small"
                                            sx={{ width: 150 }}
                                            InputProps={{
                                                startAdornment: (
                                                    <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                                                )
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        name="isActive"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={field.value}
                                                        onChange={field.onChange}
                                                        color="success"
                                                    />
                                                }
                                                label={
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <Chip
                                                            label={field.value ? "Active" : "Inactive"}
                                                            size="small"
                                                            color={field.value ? "success" : "default"}
                                                            variant={field.value ? "filled" : "outlined"}
                                                        />
                                                        <Typography variant="body2">
                                                            {field.value ? 'Grade is active and can be assigned' : 'Grade is inactive and hidden'}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Quick Actions */}
                        <Paper elevation={0} sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 3
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                Quick Actions
                            </Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Add />}
                                    onClick={addNewComponent}
                                    fullWidth
                                >
                                    Add Custom Component
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<ContentCopy />}
                                    onClick={addDefaultComponents}
                                    fullWidth
                                >
                                    Add Default Components
                                </Button>

                                <Button
                                    variant="outlined"
                                    startIcon={<Calculate />}
                                    onClick={() => setShowPreview(!showPreview)}
                                    fullWidth
                                >
                                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Column - Components */}
                    <Grid item xs={12} md={7}>
                        <Paper elevation={0} sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 3,
                            mb: 3
                        }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Salary Components ({fields.length})
                                </Typography>
                                <Chip
                                    label={`${fields.filter(f => f.isActive).length} Active`}
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                />
                            </Box>

                            {fields.length === 0 ? (
                                <Alert severity="info">
                                    <Typography>
                                        No salary components added yet. Add components or use default templates.
                                    </Typography>
                                </Alert>
                            ) : (
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell width="40">#</TableCell>
                                                <TableCell>Component Name</TableCell>
                                                <TableCell width="120">Type</TableCell>
                                                <TableCell width="100">Frequency</TableCell>
                                                <TableCell width="100">Value</TableCell>
                                                <TableCell width="80">Active</TableCell>
                                                <TableCell width="100">Actions</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {fields.map((field, index) => (
                                                <TableRow key={field.id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                                                            <Typography variant="body2">{index + 1}</Typography>
                                                            <Box>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => moveComponent(index, 'up')}
                                                                    disabled={index === 0}
                                                                >
                                                                    <ArrowUpward fontSize="small" />
                                                                </IconButton>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => moveComponent(index, 'down')}
                                                                    disabled={index === fields.length - 1}
                                                                >
                                                                    <ArrowDownward fontSize="small" />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell>
                                                        <Controller
                                                            name={`components.${index}.name`}
                                                            control={control}
                                                            rules={{ required: 'Name is required' }}
                                                            render={({ field, fieldState }) => (
                                                                <TextField
                                                                    {...field}
                                                                    size="small"
                                                                    fullWidth
                                                                    error={!!fieldState.error}
                                                                    helperText={fieldState.error?.message}

                                                                />
                                                            )}
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <Controller
                                                            name={`components.${index}.calculationType`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <FormControl fullWidth size="small">
                                                                    <Select {...field}>
                                                                        <MenuItem value="Percentage">Percentage</MenuItem>
                                                                        <MenuItem value="Flat">Flat Amount</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            )}
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <Controller
                                                            name={`components.${index}.calculated`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <FormControl fullWidth size="small">
                                                                    <Select {...field}>
                                                                        <MenuItem value="Monthly">Monthly</MenuItem>
                                                                        <MenuItem value="Annually">Annually</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            )}
                                                        />
                                                    </TableCell>

                                                    <TableCell>
                                                        <Controller
                                                            name={`components.${index}.value`}
                                                            control={control}
                                                            rules={{
                                                                required: 'Value is required',
                                                                validate: {
                                                                    positive: (value) => value >= 0 || 'Value must be positive',
                                                                    maxPercentage: (value, formValues) => {
                                                                        const component = formValues.components[index];
                                                                        if (component.calculationType === 'Percentage') {
                                                                            return value <= 100 || 'Max 100%';
                                                                        }
                                                                        return value <= 10000000 || 'Value too high';
                                                                    }
                                                                }
                                                            }}
                                                            render={({ field, fieldState }) => {
                                                                const calculationType = watch(`components.${index}.calculationType`);

                                                                return (
                                                                    <TextField
                                                                        {...field}
                                                                        type="number"
                                                                        size="small"
                                                                        sx={{ minWidth: '130px' }}
                                                                        fullWidth
                                                                        error={!!fieldState.error}
                                                                        helperText={fieldState.error?.message}
                                                                        onChange={(e) => {
                                                                            const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                                                                            field.onChange(isNaN(val) ? 0 : val);
                                                                        }}
                                                                        onBlur={field.onBlur}
                                                                        InputProps={{
                                                                            endAdornment: (
                                                                                <Typography variant="caption">
                                                                                    {calculationType === 'Percentage' ? '%' : '₹'}
                                                                                </Typography>
                                                                            ),
                                                                            inputProps: {
                                                                                min: 0,
                                                                                max: calculationType === 'Percentage' ? 100 : undefined,
                                                                                step: calculationType === 'Percentage' ? 0.01 : 1
                                                                            }
                                                                        }}
                                                                    />
                                                                );
                                                            }}
                                                        />
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <Controller
                                                            name={`components.${index}.isActive`}
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Switch
                                                                    checked={field.value}
                                                                    onChange={field.onChange}
                                                                    size="small"
                                                                    color="success"
                                                                />
                                                            )}
                                                        />
                                                    </TableCell>

                                                    <TableCell align="center">
                                                        <IconButton
                                                            size="small"
                                                            color="error"
                                                            onClick={() => remove(index)}
                                                        >
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                            {/* Component Validation Summary */}
                            {errors.components && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    <Typography variant="body2">
                                        Please fix the following component errors:
                                    </Typography>
                                    <Box component="ul" sx={{ mt: 1, pl: 2, mb: 0 }}>
                                        {Object.entries(errors.components).map(([key, error]: [string, any]) => (
                                            <li key={key}>
                                                <Typography variant="caption">
                                                    Component {parseInt(key) + 1}: {error?.name?.message || error?.value?.message || 'Invalid'}
                                                </Typography>
                                            </li>
                                        ))}
                                    </Box>
                                </Alert>
                            )}
                        </Paper>

                        {/* Preview Section */}
                        {showPreview && fields.length > 0 && (
                            <Paper elevation={0} sx={{
                                border: '1px solid',
                                borderColor: 'info.light',
                                borderRadius: 2,
                                p: 3,
                                bgcolor: 'info.50'
                            }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'info.dark', mb: 3 }}>
                                    <Calculate sx={{ mr: 1, verticalAlign: 'middle' }} />
                                    Salary Breakdown Preview
                                </Typography>

                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Component</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell align="right">Value</TableCell>
                                                <TableCell align="right">Monthly Amount</TableCell>
                                                <TableCell align="right">Annual Amount</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {totals.monthlyBreakdown.map((component, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            {component.name}
                                                            {!component.isActive && (
                                                                <Chip label="Inactive" size="small" color="default" />
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={component.calculationType}
                                                            size="small"
                                                            color={component.calculationType === 'Percentage' ? 'primary' : 'secondary'}
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {component.value}
                                                        {component.calculationType === 'Percentage' ? '%' : '₹'}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {component.isActive ? formatCurrency(component.amount) : '-'}
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        {component.isActive ? formatCurrency(component.amount * 12) : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                            <TableRow sx={{ borderTop: '2px solid', borderColor: 'divider' }}>
                                                <TableCell colSpan={3}>
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        Totals
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {formatCurrency(totals.monthlyTotal)}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Monthly Gross
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {formatCurrency(totals.annualTotal)}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        Annual CTC
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>

                                <Alert severity="info" sx={{ mt: 2 }}>
                                    <Typography variant="body2">
                                        <strong>Note:</strong> Calculations are based on the Base CTC of {formatCurrency(baseCTC)}.
                                        Actual amounts may vary based on individual employee configurations.
                                    </Typography>
                                </Alert>
                            </Paper>
                        )}
                    </Grid>
                </Grid>
            </form>

            {/* Tips Section */}
            <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.50', borderColor: 'info.light' }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: 'info.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        <HelpOutline sx={{ color: 'info.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h6" sx={{ color: 'info.dark', fontWeight: 600 }}>
                            Salary Grade Configuration Tips
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
                            <li>
                                <Typography variant="body2">
                                    <strong>Basic Salary:</strong> Typically 40-50% of CTC. This is the core component for most calculations.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2">
                                    <strong>Allowances:</strong> House Rent Allowance (HRA) is usually 40-50% of Basic for tax benefits.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2">
                                    <strong>Deductions:</strong> Include mandatory deductions like PF, ESIC, Professional Tax.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2">
                                    <strong>Tax Planning:</strong> Structure components to maximize tax benefits for employees.
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2">
                                    <strong>Order Matters:</strong> Arrange components in logical order (Basic first, then allowances, then deductions).
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2">
                                    <strong>Compliance:</strong> Ensure all statutory components are included and correctly calculated.
                                </Typography>
                            </li>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </div>
    );
};

export default AddEditSalaryGrade;