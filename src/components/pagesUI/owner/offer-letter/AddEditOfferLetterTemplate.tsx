"use client";

import React, { useState, useEffect, useRef } from "react";
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
    Tab,
    Tabs,
    Autocomplete,
    Card,
    CardContent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
} from "@mui/material";
import {
    Save,
    Cancel,
    Add,
    Delete,
    ContentCopy,
    Code,
    FormatColorText,
    InsertDriveFile,
    Preview,
    HelpOutline,
    Description,
    ArrowDropDown,
    ArrowDropUp,
    DataObject,
    Functions,
    TextFields,
    CalendarMonth,
    AttachMoney,
    Visibility,
    Edit
} from "@mui/icons-material";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import { IOfferLetterTemplate, ITemplateVariable, validateTemplate } from "./OfferLetterTypes";

interface AddEditOfferLetterTemplateProps {
    template?: IOfferLetterTemplate;
    mode: 'add' | 'edit';
    onSave: (data: any) => Promise<void>;
    onCancel: () => void;
}

// Define form data interface
interface TemplateFormData {
    name: string;
    code: string;
    description: string;
    department: string;
    position: string;
    category: 'Full-time' | 'Intern' | 'Contract' | 'Consultant';
    status: 'Draft' | 'Published' | 'Archived';
    isActive: boolean;
    tags: string[];
    accessLevel: 'Public' | 'Restricted' | 'Private';
    variables: ITemplateVariable[];
}

// Sample data for preview
const defaultSampleData = {
    candidateName: "John Doe",
    position: "Senior Software Engineer",
    startDate: "2024-03-01",
    salary: "$95,000",
    department: "Engineering",
    location: "New York, NY",
    reportingManager: "Jane Smith",
    employeeId: "EMP-2024-001"
};

// Define default form values
const defaultValues: TemplateFormData = {
    name: '',
    code: '',
    description: '',
    department: '',
    position: '',
    category: 'Full-time',
    status: 'Draft',
    isActive: true,
    tags: [],
    accessLevel: 'Public',
    variables: []
};

const defaultTemplateContent = `<!DOCTYPE html>
<html>
<head>
    <title>Offer Letter</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { text-align: center; margin-bottom: 30px; }
        .content { line-height: 1.6; }
        .footer { margin-top: 50px; }
        .signature { margin-top: 40px; }
        .variable { background-color: #f0f0f0; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
    </style>
</head>
<body>
    <div class="header">
        <h1>OFFER LETTER</h1>
    </div>
    
    <div class="content">
        <p>Dear {{candidateName}},</p>
        
        <p>We are pleased to offer you the position of <strong>{{position}}</strong> at our company.</p>
        
        <p><strong>Position:</strong> {{position}}</p>
        <p><strong>Department:</strong> {{department}}</p>
        <p><strong>Start Date:</strong> {{startDate}}</p>
        <p><strong>Location:</strong> {{location}}</p>
        <p><strong>Salary:</strong> {{salary}}</p>
        <p><strong>Reporting Manager:</strong> {{reportingManager}}</p>
        <p><strong>Employee ID:</strong> {{employeeId}}</p>
        
        <p>We believe your skills and experience will be a valuable addition to our team.</p>
        
        <p>Please sign and return this letter to indicate your acceptance of this offer.</p>
    </div>
    
    <div class="signature">
        <p>Sincerely,</p>
        <p><strong>HR Department</strong></p>
    </div>
    
    <div class="footer">
        <p>This is an auto-generated offer letter. For any queries, contact HR.</p>
    </div>
</body>
</html>`;

const AddEditOfferLetterTemplate: React.FC<AddEditOfferLetterTemplateProps> = ({
    template,
    mode = 'add',
    onSave,
    onCancel
}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [templateContent, setTemplateContent] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewLoading, setPreviewLoading] = useState(false);
    const [previewHtml, setPreviewHtml] = useState("");
    const [sampleData, setSampleData] = useState<Record<string, any>>({});

    const templateContentRef = useRef<HTMLTextAreaElement>(null);

    const availableVariables: ITemplateVariable[] = [
        { id: "1", name: "Candidate Name", key: "candidateName", type: "text", required: true },
        { id: "2", name: "Position", key: "position", type: "text", required: true },
        { id: "3", name: "Start Date", key: "startDate", type: "date", required: true },
        { id: "4", name: "Salary", key: "salary", type: "currency", required: true },
        { id: "5", name: "Department", key: "department", type: "text", required: false },
        { id: "6", name: "Location", key: "location", type: "text", required: false },
        { id: "7", name: "Reporting Manager", key: "reportingManager", type: "text", required: false },
        { id: "8", name: "Employee ID", key: "employeeId", type: "text", required: false }
    ];







    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isDirty }
    } = useForm<TemplateFormData>({
        defaultValues
    });

    const { fields, append, remove, move, update } = useFieldArray({
        control,
        name: "variables"
    });

    // Watch form values
    const watchName = watch("name");
    const watchCode = watch("code");
    const watchCategory = watch("category");

    // Load template data in edit mode
    useEffect(() => {
        if (template && mode === 'edit') {
            const formData: TemplateFormData = {
                name: template.name,
                code: template.code,
                description: template.description || '',
                department: template.department || '',
                position: template.position || '',
                category: template.category,
                status: template.status,
                isActive: template.isActive,
                tags: template.tags,
                accessLevel: template.accessLevel,
                variables: template.versions[0]?.variables || []
            };

            reset(formData);
            setTemplateContent(template.versions[0]?.content || defaultTemplateContent);

            // Initialize sample data for existing variables
            const initialSampleData: Record<string, any> = {};
            template.versions[0]?.variables?.forEach(variable => {
                initialSampleData[variable.key] = getDefaultSampleValue(variable);
            });
            setSampleData(initialSampleData);
        } else {
            reset(defaultValues);
            setTemplateContent(defaultTemplateContent);
            setSampleData(defaultSampleData);
        }
    }, [template, mode, reset]);

    // Get default sample value for variable type
    const getDefaultSampleValue = (variable: ITemplateVariable): any => {
        switch (variable.type) {
            case 'text':
                return `${variable.name} Sample`;
            case 'number':
                return "12345";
            case 'date':
                return new Date().toISOString().split('T')[0];
            case 'currency':
                return "$10,000";
            case 'select':
                return "Option 1";
            default:
                return `Sample ${variable.name}`;
        }
    };

    // Generate code from name
    const generateCode = () => {
        if (watchName && !watchCode) {
            const code = watchName
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .substring(0, 10);
            setValue('code', code);
        }
    };

    // Add variable from available variables
    const addVariable = (variable: ITemplateVariable) => {
        append({
            ...variable,
            id: `var-${Date.now()}-${fields.length}`
        });

        // Add to sample data
        setSampleData(prev => ({
            ...prev,
            [variable.key]: getDefaultSampleValue(variable)
        }));
    };

    // Insert variable into template content - FIXED VERSION
    const insertVariable = (variableKey: string) => {
        // Switch to template content tab first
        setActiveTab(1);

        // Small delay to ensure tab switch completes
        setTimeout(() => {
            const textarea = templateContentRef.current;
            if (textarea) {
                // Ensure textarea has focus
                textarea.focus();

                // Get cursor position
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const variable = `{{${variableKey}}}`;

                // Create new content with variable inserted at cursor
                const newContent =
                    templateContent.substring(0, start) +
                    variable +
                    templateContent.substring(end);

                // Update content
                setTemplateContent(newContent);

                // Update cursor position after content updates
                setTimeout(() => {
                    if (textarea) {
                        textarea.focus();
                        const newCursorPos = start + variable.length;
                        textarea.setSelectionRange(newCursorPos, newCursorPos);
                    }
                }, 50);

                toast.success(`Variable {{${variableKey}}} inserted`);
            } else {
                // Fallback: append variable to end of content
                const variable = `{{${variableKey}}}`;
                setTemplateContent(prev => prev + variable);
                toast.info(`Variable {{${variableKey}}} added to end of content`);
            }
        }, 100);
    };

    // Extract variables from content
    const extractVariablesFromContent = () => {
        const regex = /\{\{([^}]+)\}\}/g;
        const matches = templateContent.match(regex);
        if (matches) {
            const extractedVars = matches.map(match => {
                const key = match.replace(/\{\{|\}\}/g, '');
                return {
                    id: `extracted-${key}`,
                    name: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
                    key,
                    type: 'text' as const,
                    required: false
                };
            });

            // Add unique extracted variables
            extractedVars.forEach(variable => {
                if (!fields.some(f => f.key === variable.key) &&
                    !availableVariables.some(v => v.key === variable.key)) {
                    append(variable);
                    setSampleData(prev => ({
                        ...prev,
                        [variable.key]: getDefaultSampleValue(variable)
                    }));
                }
            });

            toast.success(`Extracted ${extractedVars.length} variables from content`);
        }
    };

    // Generate preview HTML
    const generatePreview = () => {
        setPreviewLoading(true);

        try {
            let previewContent = templateContent;

            // Replace all variables with sample data or placeholder
            fields.forEach(variable => {
                const regex = new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g');
                const value = sampleData[variable.key] || `[${variable.name}]`;
                previewContent = previewContent.replace(regex, `<span class="variable">${value}</span>`);
            });

            // Replace any remaining variables
            const remainingRegex = /\{\{([^}]+)\}\}/g;
            previewContent = previewContent.replace(remainingRegex, '<span class="variable" style="background-color: #ffebee; color: #c62828;">[$1]</span>');

            setPreviewHtml(previewContent);
            setPreviewOpen(true);
        } catch (error) {
            console.error('Error generating preview:', error);
            toast.error('Failed to generate preview');
        } finally {
            setPreviewLoading(false);
        }
    };

    // Update sample data for preview
    const updateSampleData = (variableKey: string, value: string) => {
        setSampleData(prev => ({
            ...prev,
            [variableKey]: value
        }));
    };

    const onSubmit = async (data: TemplateFormData) => {
        const validationErrors = validateTemplate(data);
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => toast.error(error));
            return;
        }

        if (!templateContent.trim()) {
            toast.error('Template content is required');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave({
                ...data,
                content: templateContent,
                variables: fields
            });

        } catch (error) {
            console.error('Error saving template:', error);
            toast.error('Failed to save template');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (isDirty) {
            if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                onCancel();
            }
        } else {
            onCancel();
        }
    };

    const formatVariablePreview = () => {
        let preview = templateContent;
        fields.forEach(variable => {
            const regex = new RegExp(`\\{\\{${variable.key}\\}\\}`, 'g');
            preview = preview.replace(regex, `[${variable.name}]`);
        });
        return preview.substring(0, 200) + (preview.length > 200 ? '...' : '');
    };

    const tabs = [
        { label: "Basic Info", icon: <Description /> },
        { label: "Template Content", icon: <FormatColorText /> },
        { label: "Variables", icon: <DataObject /> },
        { label: "Preview", icon: <Preview /> }
    ];

    const categoryOptions: TemplateFormData['category'][] = ['Full-time', 'Intern', 'Contract', 'Consultant'];
    const departmentOptions = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'Support', 'All'];
    const accessLevelOptions: TemplateFormData['accessLevel'][] = ['Public', 'Restricted', 'Private'];

    // Get icon for variable type
    const getVariableTypeIcon = (type: string) => {
        switch (type) {
            case 'text': return <TextFields fontSize="small" />;
            case 'number': return <Functions fontSize="small" />;
            case 'date': return <CalendarMonth fontSize="small" />;
            case 'currency': return <AttachMoney fontSize="small" />;
            default: return <DataObject fontSize="small" />;
        }
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
                            <a href="/owner/templates">Offer Letter Templates</a>
                        </li>
                        <li className="breadcrumb-item active">
                            {mode === 'add' ? 'Create New Template' : 'Edit Template'}
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
                        {isSubmitting ? 'Saving...' : 'Save Template'}
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
                        <InsertDriveFile sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                            {mode === 'add' ? 'Create New Offer Letter Template' : 'Edit Template'}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Design and configure templates with variables and formatting
                        </Typography>
                    </Box>
                </Box>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={4}>
                    {/* Left Column - Basic Info & Variables */}
                    <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 3,
                            mb: 3
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                Template Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        rules={{ required: 'Template name is required' }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Template Name *"
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
                                        rules={{ required: 'Template code is required' }}
                                        render={({ field, fieldState }) => (
                                            <TextField
                                                {...field}
                                                label="Template Code *"
                                                fullWidth
                                                error={!!fieldState.error}
                                                helperText={fieldState.error?.message || 'Unique identifier'}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth>
                                                <InputLabel>Category *</InputLabel>
                                                <Select {...field} label="Category *">
                                                    {categoryOptions.map(option => (
                                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        name="department"
                                        control={control}
                                        render={({ field }) => (
                                            <Autocomplete
                                                {...field}
                                                options={departmentOptions}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Department"
                                                        placeholder="Select department"
                                                    />
                                                )}
                                                onChange={(_, value) => field.onChange(value)}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        name="position"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                label="Position"
                                                fullWidth
                                                placeholder="e.g., Software Engineer"
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
                                                placeholder="Describe this template and its purpose..."
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        name="tags"
                                        control={control}
                                        render={({ field }) => (
                                            <Autocomplete
                                                multiple
                                                {...field}
                                                options={['engineering', 'full-time', 'intern', 'contract', 'legal', 'standard']}
                                                onChange={(_, value) => field.onChange(value)}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Tags"
                                                        placeholder="Add tags..."
                                                    />
                                                )}
                                                renderTags={(value) =>
                                                    value.map((option, index) => (
                                                        <Chip
                                                            key={`${option}-${index}`}
                                                            label={option}
                                                            size="small"
                                                            onDelete={() => {
                                                                const newValue = value.filter((_, i) => i !== index);
                                                                field.onChange(newValue);
                                                            }}
                                                        />
                                                    ))
                                                }
                                            />

                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Controller
                                        name="accessLevel"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth>
                                                <InputLabel>Access Level</InputLabel>
                                                <Select {...field} label="Access Level">
                                                    {accessLevelOptions.map(option => (
                                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
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
                                                            Template is {field.value ? 'active' : 'inactive'}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Quick Variables */}
                        <Paper elevation={0} sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 3
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                Quick Variables
                            </Typography>

                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Click to insert into template
                            </Typography>

                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                                {availableVariables.map(variable => (
                                    <Chip
                                        key={variable.id}
                                        label={variable.name}
                                        onClick={() => insertVariable(variable.key)}
                                        icon={getVariableTypeIcon(variable.type)}
                                        size="small"
                                        variant="outlined"
                                        sx={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </Box>

                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={() => {
                                    const newVar: ITemplateVariable = {
                                        id: `custom-${Date.now()}`,
                                        name: 'New Variable',
                                        key: 'newVariable',
                                        type: 'text',
                                        required: false
                                    };
                                    append(newVar);
                                    setSampleData(prev => ({
                                        ...prev,
                                        [newVar.key]: getDefaultSampleValue(newVar)
                                    }));
                                }}
                                sx={{ mt: 2 }}
                            >
                                Add Custom Variable
                            </Button>
                        </Paper>
                    </Grid>

                    {/* Right Column - Content & Preview */}
                    <Grid item xs={12} md={8}>
                        {/* Tabs */}
                        <Paper elevation={0} sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            mb: 3
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1 }}>
                                <Tabs
                                    value={activeTab}
                                    onChange={(_, newValue) => setActiveTab(newValue)}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                >
                                    {tabs.map((tab, index) => (
                                        <Tab
                                            key={index}
                                            icon={tab.icon}
                                            iconPosition="start"
                                            label={tab.label}
                                        />
                                    ))}
                                </Tabs>
                                <Button
                                    variant="contained"
                                    startIcon={previewLoading ? <CircularProgress size={20} color="inherit" /> : <Visibility />}
                                    onClick={generatePreview}
                                    disabled={previewLoading}
                                    sx={{ ml: 2 }}
                                >
                                    Preview
                                </Button>
                            </Box>
                        </Paper>

                        {/* Tab Content */}
                        <Box sx={{ mt: 2 }}>
                            {activeTab === 0 && (
                                <Alert severity="info">
                                    <Typography variant="body2">
                                        Configure basic template information. Use the tabs above to edit content and variables.
                                    </Typography>
                                </Alert>
                            )}

                            {activeTab === 1 && (
                                <Paper elevation={0} sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    p: 3
                                }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Template Content
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                size="small"
                                                startIcon={<ContentCopy />}
                                                onClick={() => {
                                                    navigator.clipboard.writeText(templateContent);
                                                    toast.success('Content copied to clipboard');
                                                }}
                                            >
                                                Copy
                                            </Button>
                                            <Button
                                                size="small"
                                                startIcon={<DataObject />}
                                                onClick={extractVariablesFromContent}
                                            >
                                                Extract Variables
                                            </Button>
                                        </Box>
                                    </Box>

                                    <TextField
                                        inputRef={templateContentRef}
                                        id="template-content"
                                        label="HTML Content"
                                        multiline
                                        rows={20}
                                        fullWidth
                                        value={templateContent}
                                        onChange={(e) => setTemplateContent(e.target.value)}
                                        sx={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                                        placeholder="Enter HTML content with {{variables}}..."
                                    />

                                    <Alert severity="info" sx={{ mt: 2 }}>
                                        <Typography variant="body2">
                                            <strong>Tip:</strong> Use double curly braces for variables: &#123;&#123;variableName&#125;&#125;
                                        </Typography>
                                    </Alert>
                                </Paper>
                            )}

                            {activeTab === 2 && (
                                <Paper elevation={0} sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    p: 3
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                        Template Variables ({fields.length})
                                    </Typography>

                                    {fields.length === 0 ? (
                                        <Alert severity="info">
                                            <Typography>
                                                No variables defined. Add variables or extract them from content.
                                            </Typography>
                                        </Alert>
                                    ) : (
                                        <TableContainer>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Variable Name</TableCell>
                                                        <TableCell>Key</TableCell>
                                                        <TableCell>Type</TableCell>
                                                        <TableCell>Required</TableCell>
                                                        <TableCell>Sample Value</TableCell>
                                                        <TableCell>Actions</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {fields.map((field, index) => (
                                                        <TableRow key={field.id}>
                                                            <TableCell>
                                                                <Controller
                                                                    name={`variables.${index}.name`}
                                                                    control={control}
                                                                    rules={{ required: 'Name is required' }}
                                                                    render={({ field: inputField, fieldState }) => (
                                                                        <TextField
                                                                            {...inputField}
                                                                            size="small"
                                                                            fullWidth
                                                                            error={!!fieldState.error}
                                                                        />
                                                                    )}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Controller
                                                                    name={`variables.${index}.key`}
                                                                    control={control}
                                                                    rules={{
                                                                        required: 'Key is required',
                                                                        pattern: {
                                                                            value: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
                                                                            message: 'Only letters, numbers, and underscores'
                                                                        }
                                                                    }}
                                                                    render={({ field: inputField, fieldState }) => (
                                                                        <TextField
                                                                            {...inputField}
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
                                                                    name={`variables.${index}.type`}
                                                                    control={control}
                                                                    render={({ field: inputField }) => (
                                                                        <FormControl fullWidth size="small">
                                                                            <Select {...inputField}>
                                                                                <MenuItem value="text">Text</MenuItem>
                                                                                <MenuItem value="number">Number</MenuItem>
                                                                                <MenuItem value="date">Date</MenuItem>
                                                                                <MenuItem value="currency">Currency</MenuItem>
                                                                                <MenuItem value="select">Select</MenuItem>
                                                                            </Select>
                                                                        </FormControl>
                                                                    )}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <Controller
                                                                    name={`variables.${index}.required`}
                                                                    control={control}
                                                                    render={({ field: inputField }) => (
                                                                        <Switch
                                                                            checked={inputField.value}
                                                                            onChange={inputField.onChange}
                                                                            size="small"
                                                                        />
                                                                    )}
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <TextField
                                                                    size="small"
                                                                    fullWidth
                                                                    value={sampleData[field.key] || ''}
                                                                    onChange={(e) => updateSampleData(field.key, e.target.value)}
                                                                    placeholder="Sample value for preview"
                                                                />
                                                            </TableCell>
                                                            <TableCell>
                                                                <IconButton
                                                                    size="small"
                                                                    color="error"
                                                                    onClick={() => {
                                                                        remove(index);
                                                                        // Remove from sample data
                                                                        const newSampleData = { ...sampleData };
                                                                        delete newSampleData[field.key];
                                                                        setSampleData(newSampleData);
                                                                    }}
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

                                    <Button
                                        startIcon={<Add />}
                                        onClick={() => {
                                            const newVar: ITemplateVariable = {
                                                id: `new-${Date.now()}`,
                                                name: '',
                                                key: '',
                                                type: 'text',
                                                required: false
                                            };
                                            append(newVar);
                                            setSampleData(prev => ({
                                                ...prev,
                                                [newVar.key]: getDefaultSampleValue(newVar)
                                            }));
                                        }}
                                        sx={{ mt: 2 }}
                                    >
                                        Add Variable
                                    </Button>
                                </Paper>
                            )}

                            {activeTab === 3 && (
                                <Paper elevation={0} sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    p: 3
                                }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                                        Preview Configuration
                                    </Typography>

                                    <Card variant="outlined" sx={{ mb: 3 }}>
                                        <CardContent>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                Configure sample data for preview:
                                            </Typography>
                                            <Grid container spacing={2}>
                                                {fields.map((variable) => (
                                                    <Grid item xs={12} sm={6} key={variable.id}>
                                                        <TextField
                                                            label={variable.name}
                                                            size="small"
                                                            fullWidth
                                                            value={sampleData[variable.key] || ''}
                                                            onChange={(e) => updateSampleData(variable.key, e.target.value)}
                                                            helperText={`{{${variable.key}}}`}
                                                        />
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </CardContent>
                                    </Card>

                                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                        <Button
                                            variant="contained"
                                            startIcon={<Visibility />}
                                            onClick={generatePreview}
                                            disabled={previewLoading}
                                        >
                                            {previewLoading ? 'Generating Preview...' : 'Generate Full Preview'}
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={<ContentCopy />}
                                            onClick={() => {
                                                navigator.clipboard.writeText(templateContent);
                                                toast.success('Content copied to clipboard');
                                            }}
                                        >
                                            Copy Content
                                        </Button>
                                    </Box>

                                    <Alert severity="info" sx={{ mt: 3 }}>
                                        <Typography variant="body2">
                                            <strong>Note:</strong> Click {`'Generate Full Preview'`} to see a rendered HTML preview with your sample data.
                                        </Typography>
                                    </Alert>
                                </Paper>
                            )}
                        </Box>

                        {/* Content Stats */}
                        <Paper elevation={0} sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 3,
                            mt: 3
                        }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6">{templateContent.length}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Characters
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6">{fields.length}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Variables
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6">
                                            {templateContent.split('{{').length - 1}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Variable Instances
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography variant="h6">{watchCategory}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Category
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </form>

            {/* Preview Dialog */}
            <Dialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                maxWidth="lg"
                fullWidth
                scroll="paper"
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Visibility />
                    <Typography variant="h6">Template Preview</Typography>
                    <Chip label="Preview" color="info" size="small" />
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ p: 2 }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                This is a preview with sample data. Variables are highlighted for easy identification.
                            </Typography>
                        </Alert>

                        {previewLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 1,
                                    p: 3,
                                    bgcolor: 'background.paper'
                                }}
                            >
                                <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
                            </Box>
                        )}

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                Variables Used:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {fields.map(variable => (
                                    <Chip
                                        key={variable.id}
                                        label={`{{${variable.key}}}`}
                                        size="small"
                                        variant="outlined"
                                        icon={getVariableTypeIcon(variable.type)}
                                    />
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewOpen(false)}>Close</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            navigator.clipboard.writeText(templateContent);
                            toast.success('Content copied to clipboard');
                        }}
                    >
                        Copy HTML
                    </Button>
                </DialogActions>
            </Dialog>

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
                            Template Creation Tips
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
                            <li>
                                <Typography variant="body2">
                                    <strong>Preview Before Save:</strong> Use the Preview button to test your template with sample data
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2">
                                    <strong>Use Variables:</strong> Wrap variables in double curly braces: &#123;&#123;variableName&#125;&#125;
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2">
                                    <strong>HTML Formatting:</strong> Use proper HTML structure for professional formatting
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2">
                                    <strong>Consistent Naming:</strong> Use descriptive variable names like candidateName, startDate
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2">
                                    <strong>Required Fields:</strong> Mark essential variables as required
                                </Typography>
                            </li>
                            <li>
                                <Typography variant="body2">
                                    <strong>Sample Data:</strong> Configure realistic sample data for accurate previews
                                </Typography>
                            </li>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </div>
    );
};

export default AddEditOfferLetterTemplate;