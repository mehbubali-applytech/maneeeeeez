// SalaryTab.tsx - Fixed version
"use client";

import React, { useState, useEffect, useCallback } from "react";

import {
  Box,
  Grid,
  Typography,
  Paper,
  Chip,
  IconButton,
  Button,
  Divider,
  Alert,
  Collapse,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
  Autocomplete,
  MenuItem
} from "@mui/material";
import {
  AttachMoney,
  AccountBalance,
  Add,
  Delete,
  ExpandMore,
  ExpandLess,
  Visibility,
  VisibilityOff,
  AutoFixHigh,
  Calculate
} from "@mui/icons-material";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
import InputField from "@/components/elements/SharedInputs/InputField";

// Define a type for salary grade component without strict typing
interface SalaryGradeComponent {
  id: string;
  name: string;
  calculationType: 'Percentage' | 'Flat';
  calculated: 'Monthly' | 'Annually';
  value: number;
  order: number;
  isActive: boolean;
  description?: string;
  appliesTo?: 'All' | 'Specific';
  taxExempt?: boolean;
  maxLimit?: number;
}

// Define a type for allowance field
interface AllowanceField {
  id: string;
  name: string;
  amount: number;
  type: 'Fixed' | 'Variable';
  taxable: boolean;
  description?: string;
  maxLimit?: number;
}

// Mock salary grades data - In production, this would come from an API
const MOCK_SALARY_GRADES = [
  {
    id: 'G1',
    name: 'Grade A1',
    code: 'G1',
    description: 'Entry Level - Junior Positions',
    components: [
      {
        id: 'c1',
        name: 'Basic Salary',
        calculationType: 'Percentage' as const,
        calculated: 'Monthly' as const,
        value: 40,
        order: 1,
        isActive: true,
        description: 'Basic salary component',
        appliesTo: 'All' as const,
        taxExempt: false
      },
      {
        id: 'c2',
        name: 'House Rent Allowance',
        calculationType: 'Percentage' as const,
        calculated: 'Monthly' as const,
        value: 20,
        order: 2,
        isActive: true,
        description: 'House rent allowance',
        appliesTo: 'All' as const,
        taxExempt: true,
        maxLimit: 40000
      },
      {
        id: 'c3',
        name: 'Conveyance Allowance',
        calculationType: 'Flat' as const,
        calculated: 'Monthly' as const,
        value: 1600,
        order: 3,
        isActive: true,
        description: 'Conveyance allowance',
        appliesTo: 'All' as const,
        taxExempt: true,
        maxLimit: 19200
      },
      {
        id: 'c4',
        name: 'Medical Allowance',
        calculationType: 'Flat' as const,
        calculated: 'Monthly' as const,
        value: 1250,
        order: 4,
        isActive: true,
        description: 'Medical allowance',
        appliesTo: 'All' as const,
        taxExempt: true,
        maxLimit: 15000
      },
      {
        id: 'c5',
        name: 'Special Allowance',
        calculationType: 'Percentage' as const,
        calculated: 'Monthly' as const,
        value: 20,
        order: 5,
        isActive: true,
        description: 'Special allowance',
        appliesTo: 'All' as const,
        taxExempt: false
      }
    ],
    totalCTC: 600000,
    monthlyGross: 50000,
    annualGross: 600000,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'Admin',
    updatedBy: 'Admin'
  },
  {
    id: 'G2',
    name: 'Grade B1',
    code: 'G2',
    description: 'Mid Level - Senior Positions',
    components: [
      {
        id: 'c6',
        name: 'Basic Salary',
        calculationType: 'Percentage' as const,
        calculated: 'Monthly' as const,
        value: 45,
        order: 1,
        isActive: true,
        description: 'Basic salary component',
        appliesTo: 'All' as const,
        taxExempt: false
      },
      {
        id: 'c7',
        name: 'House Rent Allowance',
        calculationType: 'Percentage' as const,
        calculated: 'Monthly' as const,
        value: 25,
        order: 2,
        isActive: true,
        description: 'House rent allowance',
        appliesTo: 'All' as const,
        taxExempt: true,
        maxLimit: 60000
      },
      {
        id: 'c8',
        name: 'Conveyance Allowance',
        calculationType: 'Flat' as const,
        calculated: 'Monthly' as const,
        value: 2000,
        order: 3,
        isActive: true,
        description: 'Conveyance allowance',
        appliesTo: 'All' as const,
        taxExempt: true,
        maxLimit: 24000
      },
      {
        id: 'c9',
        name: 'Medical Allowance',
        calculationType: 'Flat' as const,
        calculated: 'Monthly' as const,
        value: 1500,
        order: 4,
        isActive: true,
        description: 'Medical allowance',
        appliesTo: 'All' as const,
        taxExempt: true,
        maxLimit: 18000
      },
      {
        id: 'c10',
        name: 'Leave Travel Allowance',
        calculationType: 'Flat' as const,
        calculated: 'Monthly' as const,
        value: 1000,
        order: 5,
        isActive: true,
        description: 'Leave travel allowance',
        appliesTo: 'All' as const,
        taxExempt: true,
        maxLimit: 12000
      },
      {
        id: 'c11',
        name: 'Special Allowance',
        calculationType: 'Percentage' as const,
        calculated: 'Monthly' as const,
        value: 15,
        order: 6,
        isActive: true,
        description: 'Special allowance',
        appliesTo: 'All' as const,
        taxExempt: false
      }
    ],
    totalCTC: 1200000,
    monthlyGross: 100000,
    annualGross: 1200000,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'Admin',
    updatedBy: 'Admin'
  },
  {
    id: 'G3',
    name: 'Grade C1',
    code: 'G3',
    description: 'Executive Level - Manager Positions',
    components: [
      {
        id: 'c12',
        name: 'Basic Salary',
        calculationType: 'Percentage' as const,
        calculated: 'Monthly' as const,
        value: 50,
        order: 1,
        isActive: true,
        description: 'Basic salary component',
        appliesTo: 'All' as const,
        taxExempt: false
      },
      {
        id: 'c13',
        name: 'House Rent Allowance',
        calculationType: 'Percentage' as const,
        calculated: 'Monthly' as const,
        value: 30,
        order: 2,
        isActive: true,
        description: 'House rent allowance',
        appliesTo: 'All' as const,
        taxExempt: true,
        maxLimit: 100000
      },
      {
        id: 'c14',
        name: 'Conveyance Allowance',
        calculationType: 'Flat' as const,
        calculated: 'Monthly' as const,
        value: 3000,
        order: 3,
        isActive: true,
        description: 'Conveyance allowance',
        appliesTo: 'All' as const,
        taxExempt: true,
        maxLimit: 36000
      },
      {
        id: 'c15',
        name: 'Medical Allowance',
        calculationType: 'Flat' as const,
        calculated: 'Monthly' as const,
        value: 2000,
        order: 4,
        isActive: true,
        description: 'Medical allowance',
        appliesTo: 'All' as const,
        taxExempt: true,
        maxLimit: 24000
      },
      {
        id: 'c16',
        name: 'Leave Travel Allowance',
        calculationType: 'Flat' as const,
        calculated: 'Monthly' as const,
        value: 2000,
        order: 5,
        isActive: true,
        description: 'Leave travel allowance',
        appliesTo: 'All' as const,
        taxExempt: true,
        maxLimit: 24000
      },
      {
        id: 'c17',
        name: 'Driver Allowance',
        calculationType: 'Flat' as const,
        calculated: 'Monthly' as const,
        value: 5000,
        order: 6,
        isActive: true,
        description: 'Driver allowance',
        appliesTo: 'All' as const,
        taxExempt: false
      },
      {
        id: 'c18',
        name: 'Special Allowance',
        calculationType: 'Percentage' as const,
        calculated: 'Monthly' as const,
        value: 10,
        order: 7,
        isActive: true,
        description: 'Special allowance',
        appliesTo: 'All' as const,
        taxExempt: false
      }
    ],
    totalCTC: 2400000,
    monthlyGross: 200000,
    annualGross: 2400000,
    isActive: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    createdBy: 'Admin',
    updatedBy: 'Admin'
  }
];

const SalaryTab: React.FC = () => {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [maskAccountNumber, setMaskAccountNumber] = useState(true);
  const [salaryGrades] = useState(MOCK_SALARY_GRADES);
  const [isApplyingGrade, setIsApplyingGrade] = useState(false);
  
  // Use field arrays for dynamic allowances and deductions
  const { fields: allowanceFields, append: appendAllowance, remove: removeAllowance, replace: replaceAllowances } = useFieldArray({
    control,
    name: "allowances"
  });

  const { fields: deductionFields, append: appendDeduction, remove: removeDeduction } = useFieldArray({
    control,
    name: "deductions"
  });

  // Watch form values
  const watchCTC = watch('costToCompany') || 0;
  const watchBasicPay = watch('basicPay') || 0;
  const watchHRA = watch('hra') || 0;
  const watchAllowances = watch('allowances') as AllowanceField[] || [];
  const watchDeductions = watch('deductions') || [];
  const watchPayFrequency = watch('payFrequency');
  const watchSalaryGrade = watch('salaryGrade');
  
  // Calculate totals
  const totalAllowances = watchAllowances.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
  const totalDeductions = watchDeductions.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
  
  const totalEarnings = watchBasicPay + watchHRA + totalAllowances;
  const netSalary = totalEarnings - totalDeductions;
  
  const getMultiplierForFrequency = (frequency: string) => {
    switch(frequency) {
      case 'Monthly': return 12;
      case 'Weekly': return 52;
      case 'Bi-weekly': return 26;
      default: return 12;
    }
  };

  const annualSalary = netSalary * getMultiplierForFrequency(watchPayFrequency);


  // Salary grade options (for dropdown)
  const SALARY_GRADE_OPTIONS = salaryGrades.map(grade => ({
    id: grade.id,
    name: grade.name,
    description: grade.description,
    totalCTC: grade.totalCTC
  }));

  // Pay frequency options
  const PAY_FREQUENCY_OPTIONS = [
    { id: 'Monthly', name: 'Monthly' },
    { id: 'Weekly', name: 'Weekly' },
    { id: 'Bi-weekly', name: 'Bi-weekly' }
  ];

  // Allowance type options
  const ALLOWANCE_TYPE_OPTIONS = [
    { id: 'Fixed', name: 'Fixed' },
    { id: 'Variable', name: 'Variable' }
  ];

  // Deduction type options
  const DEDUCTION_TYPE_OPTIONS = [
    { id: 'Fixed', name: 'Fixed' },
    { id: 'Percentage', name: 'Percentage' }
  ];

  // Function to calculate amount for a component
  const calculateComponentAmount = (component: SalaryGradeComponent, ctc: number): number => {
    if (!component.isActive) return 0;

    let amount = 0;
    
    if (component.calculationType === 'Percentage') {
      // Percentage calculation (annual)
      amount = (ctc * component.value) / 100;
    } else {
      // Flat amount (monthly)
      amount = component.value * 12; // Convert to annual
    }

    return amount;
  };

const applySalaryGrade = useCallback(
  (gradeId: string, ctc: number) => {
    setIsApplyingGrade(true);

    const selectedGrade = salaryGrades.find(g => g.id === gradeId);
    if (!selectedGrade) {
      setIsApplyingGrade(false);
      return;
    }

    replaceAllowances([]);

    let basicPay = 0;
    let hra = 0;
    const allowances: AllowanceField[] = [];

    selectedGrade.components.forEach((component: SalaryGradeComponent) => {
      if (!component.isActive) return;

      const annualAmount = calculateComponentAmount(component, ctc);
      const monthlyAmount = annualAmount / 12;

      if (component.name.includes("Basic")) {
        basicPay = monthlyAmount;
      } else if (component.name.includes("House Rent")) {
        hra = monthlyAmount;
      } else {
        allowances.push({
          id: component.id,
          name: component.name,
          amount: Math.round(monthlyAmount),
          type: component.calculationType === "Percentage" ? "Variable" : "Fixed",
          taxable: !component.taxExempt,
          description: component.description,
          maxLimit: component.maxLimit
        });
      }
    });

    setValue("basicPay", Math.round(basicPay));
    setValue("hra", Math.round(hra));
    setValue("allowances", allowances);

    setIsApplyingGrade(false);
  },
  [
    salaryGrades,
    replaceAllowances,
    setValue
  ]
);


useEffect(() => {
  if (watchSalaryGrade && watchCTC > 0) {
    applySalaryGrade(watchSalaryGrade, watchCTC);
  }
}, [watchSalaryGrade, watchCTC, applySalaryGrade]);



  // Handle salary grade change
  const handleSalaryGradeChange = (gradeId: string) => {
    setValue('salaryGrade', gradeId);
    
    // Use the grade's default CTC if no CTC is set
    const ctc = watchCTC > 0 ? watchCTC : getDefaultCTCForGrade(gradeId);
    if (watchCTC === 0 && ctc > 0) {
      setValue('costToCompany', ctc);
    }
  };

  const getDefaultCTCForGrade = (gradeId: string): number => {
    const grade = salaryGrades.find(g => g.id === gradeId);
    return grade?.totalCTC || 0;
  };

  const handleAddAllowance = () => {
    appendAllowance({
      name: '',
      amount: 0,
      type: 'Fixed',
      taxable: true
    });
  };

  const handleAddDeduction = () => {
    appendDeduction({
      name: '',
      amount: 0,
      type: 'Fixed'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const maskAccountNumberDisplay = (accountNumber?: string) => {
    if (!accountNumber) return '';
    if (maskAccountNumber) {
      return `XXXXXX${accountNumber.slice(-4)}`;
    }
    return accountNumber;
  };

  // Auto-calculate basic and HRA from CTC
  const autoCalculateFromCTC = () => {
    const ctc = watchCTC || 0;
    if (ctc > 0) {
      const annualBasic = ctc * 0.4; // 40% of annual CTC
      const annualHRA = annualBasic * 0.5; // 50% of basic
      
      setValue('basicPay', Math.round(annualBasic / 12));
      setValue('hra', Math.round(annualHRA / 12));
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ 
        display: 'flex', 
        alignItems: 'center',
        mb: 3 
      }}>
        <AttachMoney sx={{ mr: 1 }} />
        Salary & Compensation
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column - Salary Structure */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Cost to Company */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2">
                  Cost to Company (CTC) *
                </Typography>
                <Button
                  size="small"
                  startIcon={<Calculate />}
                  onClick={autoCalculateFromCTC}
                  disabled={!watchCTC}
                  variant="outlined"
                >
                  Auto-calc
                </Button>
              </Box>
              <Controller
                name="costToCompany"
                control={control}
                rules={{ 
                  required: "CTC is required",
                  min: { value: 0, message: "CTC must be positive" }
                }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    label="Cost to Company (CTC) *"
                    type="number"
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      startAdornment: (
                        <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                      )
                    }}
                  />
                )}
              />
            </Box>

            {/* Salary Grade Selection */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle2">
                  Salary Grade
                </Typography>
                {watchSalaryGrade && (
                  <Chip 
                    label="Auto-populated" 
                    size="small" 
                    color="success" 
                    variant="outlined"
                    icon={<AutoFixHigh />}
                  />
                )}
              </Box>
              <Controller
                name="salaryGrade"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={SALARY_GRADE_OPTIONS}
                    getOptionLabel={(option) => option.name}
                    value={SALARY_GRADE_OPTIONS.find(grade => grade.id === field.value) || null}
                    onChange={(_, value) => {
                      field.onChange(value?.id || '');
                      if (value) {
                        handleSalaryGradeChange(value.id);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Salary Grade"
                        size="small"
                        placeholder="Select salary grade"
                        helperText="Select a grade to auto-populate salary components"
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id}>
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" fontWeight={600}>
                              {option.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatCurrency(option.totalCTC)}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {option.description}
                          </Typography>
                        </Box>
                      </MenuItem>
                    )}
                  />
                )}
              />
            </Box>

            {/* Basic Pay */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Basic Pay (Monthly)
              </Typography>
              <Controller
                name="basicPay"
                control={control}
                rules={{ min: { value: 0, message: "Basic pay must be positive" } }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      startAdornment: (
                        <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                      ),
                      endAdornment: watchBasicPay > 0 ? (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {formatCurrency(watchBasicPay * 12)} annual
                        </Typography>
                      ) : undefined
                    }}
                  />
                )}
              />
            </Box>

            {/* HRA */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                House Rent Allowance (HRA) (Monthly)
              </Typography>
              <Controller
                name="hra"
                control={control}
                rules={{ min: { value: 0, message: "HRA must be positive" } }}
                render={({ field, fieldState }) => (
                  <TextField
                    {...field}
                    type="number"
                    fullWidth
                    size="small"
                    error={!!fieldState.error}
                    helperText={fieldState.error?.message}
                    InputProps={{
                      startAdornment: (
                        <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                      ),
                      endAdornment: watchHRA > 0 ? (
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          {formatCurrency(watchHRA * 12)} annual
                        </Typography>
                      ) : undefined
                    }}
                  />
                )}
              />
            </Box>

            {/* Pay Frequency */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Pay Frequency *
              </Typography>
              <Controller
                name="payFrequency"
                control={control}
                rules={{ required: "Pay frequency is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={PAY_FREQUENCY_OPTIONS}
                    getOptionLabel={(option) => option.name}
                    value={PAY_FREQUENCY_OPTIONS.find(freq => freq.id === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.id || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select pay frequency"
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id}>
                        {option.name}
                      </MenuItem>
                    )}
                  />
                )}
              />
            </Box>

            {/* Auto-populated Allowances */}
            {watchSalaryGrade && (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'info.50', borderColor: 'info.light' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'info.dark' }}>
                    Allowances from Grade
                  </Typography>
                  <Chip 
                    label="Auto-populated" 
                    size="small" 
                    color="info" 
                  />
                </Box>

                {watchAllowances.length === 0 ? (
                  <Alert severity="info">
                    No allowances from this grade. Add manual allowances below.
                  </Alert>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Component</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell align="right">Monthly</TableCell>
                          <TableCell align="right">Annual</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {watchAllowances.map((allowance, index) => (
                          <TableRow key={allowanceFields[index]?.id || index}>
                            <TableCell>
                              <Typography variant="body2">{allowance.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {allowance.type === 'Variable' ? 'Variable' : 'Fixed'}
                                {!allowance.taxable && ' (Tax-free)'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={allowance.type} 
                                size="small" 
                                color={allowance.type === 'Variable' ? 'primary' : 'secondary'}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight={600}>
                                {formatCurrency(allowance.amount || 0)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" color="text.secondary">
                                {formatCurrency((allowance.amount || 0) * 12)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2}>
                            <Typography variant="body2" fontWeight={600}>
                              Total Allowances
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight={600}>
                              {formatCurrency(totalAllowances)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="text.secondary">
                              {formatCurrency(totalAllowances * 12)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Paper>
            )}

            {/* Manual Allowances */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Manual Allowances
                </Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={handleAddAllowance}
                  variant="outlined"
                >
                  Add Allowance
                </Button>
              </Box>

              {watchAllowances.length === 0 && !watchSalaryGrade ? (
                <Alert severity="info">
                  No allowances added. Add special allowances like travel, medical, etc.
                </Alert>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Monthly Amount</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Taxable</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {allowanceFields.map((field, index) => {
                        const allowance = watchAllowances[index] || {};
                        return (
                          <TableRow key={field.id}>
                            <TableCell>
                              <Controller
                                name={`allowances.${index}.name`}
                                control={control}
                                render={({ field: fieldController }) => (
                                  <TextField
                                    {...fieldController}
                                    size="small"
                                    fullWidth
                                    placeholder="e.g., Travel Allowance"
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Controller
                                name={`allowances.${index}.amount`}
                                control={control}
                                render={({ field: fieldController }) => (
                                  <TextField
                                    {...fieldController}
                                    type="number"
                                    size="small"
                                    fullWidth
                                    onChange={(e) => fieldController.onChange(parseFloat(e.target.value) || 0)}
                                    InputProps={{
                                      startAdornment: (
                                        <Typography variant="body2" sx={{ mr: 1 }}>₹</Typography>
                                      )
                                    }}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Controller
                                name={`allowances.${index}.type`}
                                control={control}
                                render={({ field: fieldController }) => (
                                  <Autocomplete
                                    options={ALLOWANCE_TYPE_OPTIONS}
                                    getOptionLabel={(option) => option.name}
                                    value={ALLOWANCE_TYPE_OPTIONS.find(type => type.id === fieldController.value) || null}
                                    onChange={(_, value) => fieldController.onChange(value?.id || 'Fixed')}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        size="small"
                                        fullWidth
                                      />
                                    )}
                                    renderOption={(props, option) => (
                                      <MenuItem {...props} key={option.id}>
                                        {option.name}
                                      </MenuItem>
                                    )}
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <Controller
                                name={`allowances.${index}.taxable`}
                                control={control}
                                render={({ field: fieldController }) => (
                                  <Switch
                                    checked={fieldController.value}
                                    onChange={fieldController.onChange}
                                    size="small"
                                  />
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                onClick={() => removeAllowance(index)}
                                color="error"
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Paper>

            {/* Deductions */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Deductions
                </Typography>
                <Button
                  size="small"
                  startIcon={<Add />}
                  onClick={handleAddDeduction}
                  variant="outlined"
                >
                  Add Deduction
                </Button>
              </Box>

              {deductionFields.length === 0 ? (
                <Alert severity="info">
                  No deductions added. Add deductions like PF, TDS, etc.
                </Alert>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Monthly Amount</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {deductionFields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <Controller
                              name={`deductions.${index}.name`}
                              control={control}
                              render={({ field: fieldController }) => (
                                <TextField
                                  {...fieldController}
                                  size="small"
                                  fullWidth
                                  placeholder="e.g., Provident Fund"
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              name={`deductions.${index}.amount`}
                              control={control}
                              render={({ field: fieldController }) => (
                                <TextField
                                  {...fieldController}
                                  type="number"
                                  size="small"
                                  fullWidth
                                  onChange={(e) => fieldController.onChange(parseFloat(e.target.value) || 0)}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Controller
                              name={`deductions.${index}.type`}
                              control={control}
                              render={({ field: fieldController }) => (
                                <Autocomplete
                                  options={DEDUCTION_TYPE_OPTIONS}
                                  getOptionLabel={(option) => option.name}
                                  value={DEDUCTION_TYPE_OPTIONS.find(type => type.id === fieldController.value) || null}
                                  onChange={(_, value) => fieldController.onChange(value?.id || 'Fixed')}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      size="small"
                                      fullWidth
                                    />
                                  )}
                                  renderOption={(props, option) => (
                                    <MenuItem {...props} key={option.id}>
                                      {option.name}
                                    </MenuItem>
                                  )}
                                />
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => removeDeduction(index)}
                              color="error"
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
            </Paper>
          </Box>
        </Grid>

        {/* Right Column - Bank Details & Summary */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Bank Details Toggle */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => setShowBankDetails(!showBankDetails)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccountBalance />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Bank Account Details
                  </Typography>
                </Box>
                <IconButton size="small">
                  {showBankDetails ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>

              <Collapse in={showBankDetails}>
                <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <InputField
                    label="Account Holder Name"
                    id="bankAccountName"
                    type="text"
                    required={false}
                    register={useFormContext().register("bankAccountName")}
                  />

                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2">
                        Account Number
                      </Typography>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={maskAccountNumber}
                            onChange={(e) => setMaskAccountNumber(e.target.checked)}
                            size="small"
                          />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {maskAccountNumber ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                            <Typography variant="caption">
                              {maskAccountNumber ? 'Show' : 'Hide'}
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
                    <Controller
                      name="bankAccountNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          size="small"
                          type={maskAccountNumber ? "password" : "text"}
                          value={maskAccountNumber ? maskAccountNumberDisplay(field.value) : field.value}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            field.onChange(value);
                          }}
                        />
                      )}
                    />
                  </Box>

                  <InputField
                    label="IFSC Code"
                    id="ifscCode"
                    type="text"
                    required={false}
                    register={useFormContext().register("ifscCode", {
                      pattern: {
                        value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                        message: "Invalid IFSC code format"
                      }
                    })}
                  />

                  <InputField
                    label="Bank Name"
                    id="bankName"
                    type="text"
                    required={false}
                    register={useFormContext().register("bankName")}
                  />
                </Box>
              </Collapse>
            </Paper>

            {/* Salary Summary */}
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Salary Summary
                {watchSalaryGrade && (
                  <Chip 
                    label="Based on Grade" 
                    size="small" 
                    color="success"
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Earnings - Monthly */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'success.main' }}>
                  Monthly Earnings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Basic Pay</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(watchBasicPay)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2">House Rent Allowance (HRA)</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(watchHRA)}
                    </Typography>
                  </Box>
                  
                  {/* Allowances */}
                  {watchAllowances.map((allowance: any, index: number) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{allowance.name || 'Allowance'}</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {formatCurrency(allowance.amount || 0)}
                      </Typography>
                    </Box>
                  ))}
                  
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" fontWeight={600}>Total Monthly Earnings</Typography>
                    <Typography variant="body2" fontWeight={600} color="success.main">
                      {formatCurrency(totalEarnings)}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Deductions */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'error.main' }}>
                  Monthly Deductions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {totalDeductions > 0 ? (
                    <>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2">Total Monthly Deductions</Typography>
                        <Typography variant="body2" fontWeight={600} color="error.main">
                          {formatCurrency(totalDeductions)}
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No deductions added
                    </Typography>
                  )}
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Net Salary */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Net Salary (per {watchPayFrequency?.toLowerCase() || 'month'})
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight={600}>
                    {formatCurrency(netSalary)}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  After all deductions
                </Typography>
              </Box>

              {/* Annual Summary */}
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Annual Summary
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Annual CTC
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(watchCTC || annualSalary)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Annual Take Home
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatCurrency(annualSalary)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Basic Pay (Annual)
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(watchBasicPay * 12)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      HRA (Annual)
                    </Typography>
                    <Typography variant="body2">
                      {formatCurrency(watchHRA * 12)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Pay Frequency
                    </Typography>
                    <Typography variant="body2">
                      {watchPayFrequency || 'Monthly'}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Info Alert */}
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="caption">
                  {watchSalaryGrade 
                    ? "Salary components are automatically populated based on the selected grade and CTC."
                    : "Note: Salary components are calculated based on the provided data. "}
                  Tax calculations are approximate and may vary based on actual deductions.
                </Typography>
              </Alert>
            </Paper>

            {/* Quick Actions */}
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={autoCalculateFromCTC}
                  disabled={!watchCTC}
                >
                  Auto-calc Basic & HRA
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    // Re-apply selected grade with current CTC
                    if (watchSalaryGrade && watchCTC > 0) {
                      applySalaryGrade(watchSalaryGrade, watchCTC);
                    }
                  }}
                  disabled={!watchSalaryGrade || !watchCTC || isApplyingGrade}
                >
                  {isApplyingGrade ? 'Applying...' : 'Re-calc Grade'}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => {
                    // Clear all salary data
                    setValue('costToCompany', 0);
                    setValue('basicPay', 0);
                    setValue('hra', 0);
                    setValue('allowances', []);
                    setValue('deductions', []);
                    setValue('salaryGrade', '');
                  }}
                >
                  Clear All
                </Button>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalaryTab;