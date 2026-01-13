// app/hr/salary-slip/SalarySlipGenerator.tsx (Improved Version)
"use client";

import React, { useState, useEffect, useCallback } from "react";

import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Autocomplete,
  Stack
} from "@mui/material";
import {
  Save,
  Download,
  Print,
  Mail,
  Refresh,
  CheckCircle,
  Edit,
  Calculate,
  Visibility,
  Person,
  Work,
  CalendarToday,
  EventBusy
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
  IEmployeeSalaryInfo,
  ISalarySlipForm,
  ISalarySlipData,
  formatCurrency,
  numberToWords,
  calculateDays,
  getMonthName,
  getMonthList,
  getYearList
} from "./SalarySlipTypes";
import { ISalaryComponent } from "../../owner/grade/SalaryGradeTypes";

interface SalarySlipGeneratorProps {
  employee: IEmployeeSalaryInfo;
  onSlipGenerated: (slipData: ISalarySlipData) => void;
}

// Define interface for calculated component
interface ICalculatedComponent extends ISalaryComponent {
  calculatedAmount: number;
}

// Define interface for calculation state
interface ICalculation {
  basic: number;
  totalEarnings: number;
  totalDeductions: number;
  netSalary: number;
  components: ICalculatedComponent[];
  overtimeAmount: number;
  attendancePercentage: number;
  absentDays: number;
}

const SalarySlipGenerator: React.FC<SalarySlipGeneratorProps> = ({
  employee,
  onSlipGenerated
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [calculation, setCalculation] = useState<ICalculation | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [totalDaysInMonth, setTotalDaysInMonth] = useState(30);
  const [absentDays, setAbsentDays] = useState(0);

  // Generate month options for Autocomplete
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const monthNumber = i + 1;
    return {
      value: monthNumber,
      label: getMonthName(monthNumber)
    };
  });

  // Generate year options for Autocomplete
  const yearOptions = Array.from({ length: 5 }, (_, i) => {
    const year = new Date().getFullYear() - 2 + i;
    return {
      value: year,
      label: year.toString()
    };
  });

  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<ISalarySlipForm>({
    defaultValues: {
      employeeId: employee.id,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      workingDays: 26,
      presentDays: 22,
      paidLeaves: 2,
      holidays: 2,
      overtimeHours: 0
    }
  });

  const watchMonth = watch("month");
  const watchYear = watch("year");
  const watchPresentDays = watch("presentDays");
  const watchPaidLeaves = watch("paidLeaves");
  const watchHolidays = watch("holidays");
  const watchOvertimeHours = watch("overtimeHours");

  // Calculate total days and absent days when inputs change
  useEffect(() => {
    const month = watchMonth || new Date().getMonth() + 1;
    const year = watchYear || new Date().getFullYear();
    const totalDays = calculateDays(month, year);
    setTotalDaysInMonth(totalDays);

    const weekends = Math.floor(totalDays / 7) * 2;
    const workingDays = totalDays - weekends;

    setValue("workingDays", workingDays);

    // Calculate absent days
    const presentDays = watchPresentDays || 0;
    const paidLeaves = watchPaidLeaves || 0;
    const holidays = watchHolidays || 0;

    const absent = totalDays - (presentDays + paidLeaves + holidays);
    setAbsentDays(absent > 0 ? absent : 0);

    // Auto-calculate present days if not set
    if (!watchPresentDays) {
      const autoPresent = workingDays - paidLeaves;
      setValue("presentDays", autoPresent > 0 ? autoPresent : 0);
    }
  }, [watchMonth, watchYear, watchPresentDays, watchPaidLeaves, watchHolidays, setValue]);

  // Calculate salary when inputs change
  useEffect(() => {
    calculateSalary();
  }, [watchPresentDays, watchPaidLeaves, watchHolidays, watchOvertimeHours, absentDays]);

const calculateSalary = useCallback(() => {
  if (!employee) return;

  const month = watchMonth || new Date().getMonth() + 1;
  const year = watchYear || new Date().getFullYear();
  const presentDays = watchPresentDays || 0;
  const paidLeaves = watchPaidLeaves || 0;
  const holidays = watchHolidays || 0;

  const workingDays = presentDays + paidLeaves;
  const totalDays = calculateDays(month, year);

  const attendancePercentage =
    workingDays > 0 ? (presentDays / workingDays) * 100 : 0;

  const grade = employee.salaryGrade;
  const basic = employee.basicSalary;

  let totalEarnings = 0;
  let totalDeductions = 0;

  const calculatedComponents = grade.components.map((component) => {
    let amount = component.calculationType === "Percentage"
      ? (basic * component.value) / 100
      : component.value;

    if (component.calculated === "Annually") {
      amount /= 12;
    }

    const name = component.name.toLowerCase();
    const isDeduction =
      name.includes("deduction") ||
      name.includes("tax") ||
      name.includes("pf") ||
      name.includes("esic");

    const isFixedAllowance =
      name.includes("fixed") || component.calculationType === "Flat";

    if (!isDeduction && !isFixedAllowance) {
      amount = (amount * attendancePercentage) / 100;
    }

    if (name.includes("basic") && absentDays > 0) {
      const dailyRate = amount / totalDays;
      amount -= dailyRate * absentDays;
    }

    if (isDeduction) totalDeductions += amount;
    else totalEarnings += amount;

    return { ...component, calculatedAmount: amount };
  });

  const hourlyRate = basic / (workingDays * 8 || 1);
  const overtimeAmount = hourlyRate * watchOvertimeHours * 2;

  totalEarnings += overtimeAmount;

  setCalculation({
    basic,
    totalEarnings,
    totalDeductions,
    netSalary: totalEarnings - totalDeductions,
    components: calculatedComponents,
    overtimeAmount,
    attendancePercentage,
    absentDays
  });
}, [
  employee,
  watchMonth,
  watchYear,
  watchPresentDays,
  watchPaidLeaves,
  watchHolidays,
  watchOvertimeHours,
  absentDays
]);


  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const generatePDF = () => {
    if (!calculation) return;

    const doc = new jsPDF();
    const month = getMonthName(watchMonth);
    const year = watchYear;

    // Company Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("COMPANY NAME PRIVATE LIMITED", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Registered Office Address", 105, 30, { align: "center" });
    doc.text("City, State, PIN Code | Phone: XXXX-XXXXXX", 105, 36, { align: "center" });

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("SALARY SLIP", 105, 50, { align: "center" });

    doc.setFontSize(12);
    doc.text(`For the month of ${month} ${year}`, 105, 58, { align: "center" });

    // Employee Info Table
    autoTable(doc, {
      startY: 65,
      head: [['Employee Details', 'Company Details']],
      body: [
        [`Name: ${employee.employeeName}`, `Month: ${month} ${year}`],
        [`Employee ID: ${employee.employeeCode}`, `Payment Date: ${new Date().toLocaleDateString()}`],
        [`Department: ${employee.department}`, `Bank: ${employee.bankName}`],
        [`Designation: ${employee.designation}`, `Account No: ${employee.bankAccount}`],
        [`Date of Joining: ${new Date(employee.dateOfJoining).toLocaleDateString()}`, `IFSC: ${employee.bankIFSC}`],
        [`PAN: ${employee.panNumber || 'N/A'}`, `UAN: ${employee.uanNumber || 'N/A'}`]
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' }
    });

    // Attendance Summary
    autoTable(doc, {
      startY: doc.lastAutoTable?.finalY || 65,
      head: [['Attendance Summary', 'Days']],
      body: [
        ['Total Days in Month', totalDaysInMonth.toString()],
        ['Present Days', watchPresentDays?.toString() || '0'],
        ['Paid Leaves', watchPaidLeaves?.toString() || '0'],
        ['Holidays', watchHolidays?.toString() || '0'],
        ['Absent Days', absentDays.toString()],
        ['Overtime Hours', watchOvertimeHours?.toString() || '0']
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [155, 89, 182], textColor: 255, fontStyle: 'bold' }
    });

    // Earnings Table
    const earnings = calculation.components
      .filter((c: ICalculatedComponent) => {
        const name = c.name.toLowerCase();
        return !name.includes('deduction') &&
          !name.includes('tax') &&
          !name.includes('pf') &&
          !name.includes('esic');
      })
      .map((c: ICalculatedComponent) => [c.name, formatCurrency(c.calculatedAmount)]);

    // Add overtime if any
    if (calculation.overtimeAmount > 0) {
      earnings.push(['Overtime', formatCurrency(calculation.overtimeAmount)]);
    }

    autoTable(doc, {
      startY: doc.lastAutoTable?.finalY || 65,
      head: [['Earnings', 'Amount (₹)']],
      body: [...earnings, ['Total Earnings', formatCurrency(calculation.totalEarnings)]],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [39, 174, 96], textColor: 255, fontStyle: 'bold' }
    });

    // Deductions Table
    const deductions = calculation.components
      .filter((c: ICalculatedComponent) => {
        const name = c.name.toLowerCase();
        return name.includes('deduction') ||
          name.includes('tax') ||
          name.includes('pf') ||
          name.includes('esic');
      })
      .map((c: ICalculatedComponent) => [c.name, formatCurrency(c.calculatedAmount)]);

    autoTable(doc, {
      startY: doc.lastAutoTable?.finalY || 65,
      head: [['Deductions', 'Amount (₹)']],
      body: [...deductions, ['Total Deductions', formatCurrency(calculation.totalDeductions)]],
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [231, 76, 60], textColor: 255, fontStyle: 'bold' }
    });

    // Net Salary Section
    const finalY = doc.lastAutoTable?.finalY || 65;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Net Salary: ${formatCurrency(calculation.netSalary)}`, 14, finalY + 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`In Words: ${numberToWords(calculation.netSalary)}`, 14, finalY + 28);

    // Footer
    doc.setFontSize(8);
    doc.text("This is a computer generated document and does not require signature.", 105, finalY + 55, { align: "center" });
    doc.text(`Generated on: ${new Date().toLocaleString()} by ${"HR User"}`, 105, finalY + 60, { align: "center" });

    // Save PDF
    doc.save(`Salary_Slip_${employee.employeeCode}_${month}_${year}.pdf`);

    return doc;
  };

  const onSubmit = (data: ISalarySlipForm) => {
    if (!calculation) return;

    // Helper function to find component amount
    const findComponentAmount = (searchString: string): number => {
      const component = calculation.components.find((c: ICalculatedComponent) =>
        c.name.toLowerCase().includes(searchString.toLowerCase())
      );
      return component?.calculatedAmount || 0;
    };

    const slipData: ISalarySlipData = {
      slipId: `SLIP${Date.now()}`,
      employeeInfo: employee,
      attendance: {
        totalWorkingDays: data.workingDays,
        presentDays: data.presentDays,
        paidLeaves: data.paidLeaves,
        unpaidLeaves: absentDays,
        holidays: data.holidays,
        overtimeHours: data.overtimeHours,
        lateDays: 0,
        earlyDepartures: 0
      },
      calculation: {
        month: getMonthName(data.month),
        year: data.year,
        basic: calculation.basic,
        hra: findComponentAmount('house rent'),
        da: findComponentAmount('dearness'),
        specialAllowance: findComponentAmount('special'),
        conveyance: findComponentAmount('conveyance'),
        medical: findComponentAmount('medical'),
        lta: findComponentAmount('travel'),
        otherAllowances: 0,
        totalEarnings: calculation.totalEarnings,
        pf: findComponentAmount('provident'),
        esic: findComponentAmount('esic'),
        professionalTax: findComponentAmount('professional'),
        tds: 0,
        loanAdvance: 0,
        otherDeductions: 0,
        totalDeductions: calculation.totalDeductions,
        netSalary: calculation.netSalary,
        inWords: numberToWords(calculation.netSalary)
      },
      components: calculation.components,
      generatedOn: new Date().toISOString(),
      generatedBy: "HR User",
      paymentDate: new Date(data.year, data.month, 5).toISOString().split('T')[0],
      remarks: data.adjustments?.remarks
    };

    onSlipGenerated(slipData);
    generatePDF();
    toast.success("Salary slip generated and downloaded successfully!");
  };

  const steps = ['Employee Details', 'Attendance Input', 'Review & Generate'];

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Person /> Employee Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Employee Name"
                  value={employee.employeeName}
                  fullWidth
                  disabled
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: 'text.secondary' }}>👤</Box>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Employee Code"
                  value={employee.employeeCode}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Department"
                  value={employee.department}
                  fullWidth
                  disabled
                  InputProps={{
                    startAdornment: <Work fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Designation"
                  value={employee.designation}
                  fullWidth
                  disabled
                  InputProps={{
                    startAdornment: <Work fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Salary Grade"
                  value={employee.salaryGrade.name}
                  fullWidth
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Basic Salary"
                  value={formatCurrency(employee.basicSalary)}
                  fullWidth
                  disabled
                  InputProps={{
                    startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>₹</Box>
                  }}
                />
              </Grid>

              {/* Salary Grade Components Preview */}
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  Salary Grade Components
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {employee.salaryGrade.components.slice(0, 6).map((component, index) => (
                    <Chip
                      key={index}
                      label={`${component.name} (${component.value}${component.calculationType === 'Percentage' ? '%' : '₹'})`}
                      size="small"
                      color={component.name.toLowerCase().includes('deduction') ? 'error' : 'success'}
                      variant="outlined"
                    />
                  ))}
                  {employee.salaryGrade.components.length > 6 && (
                    <Chip
                      label={`+${employee.salaryGrade.components.length - 6} more`}
                      size="small"
                      color="default"
                    />
                  )}
                </Box>
              </Grid>
            </Grid>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="body2">
                Salary components will be calculated based on the selected salary grade: <strong>{employee.salaryGrade.name}</strong>
                {employee.salaryGrade.description && (
                  <> - {employee.salaryGrade.description}</>
                )}
              </Typography>
            </Alert>
          </Paper>
        );

      case 1:
        return (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarToday /> Attendance & Days Calculation
            </Typography>
            <Grid container spacing={3}>
              {/* Month and Year Autocomplete */}
              <Grid item xs={12} md={6}>
                <Controller
                  name="month"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={monthOptions}
                      getOptionLabel={(option) => option.label}
                      value={monthOptions.find(option => option.value === field.value) || null}
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.value || new Date().getMonth() + 1);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Month *"
                          fullWidth
                          error={!!errors.month}
                          helperText={errors.month?.message}
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: <CalendarToday fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          }}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="year"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      options={yearOptions}
                      getOptionLabel={(option) => option.label}
                      value={yearOptions.find(option => option.value === field.value) || null}
                      onChange={(_, newValue) => {
                        field.onChange(newValue?.value || new Date().getFullYear());
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Year *"
                          fullWidth
                          error={!!errors.year}
                          helperText={errors.year?.message}
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Days Calculation" icon={<Calculate />} />
                </Divider>
              </Grid>

              {/* Month Summary Card */}
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Month Summary - {getMonthName(watchMonth)} {watchYear}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">Total Days</Typography>
                          <Typography variant="h6">{totalDaysInMonth}</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">Working Days</Typography>
                          <Typography variant="h6" color="primary.main">
                            {watch("workingDays") || 0}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">Weekends</Typography>
                          <Typography variant="h6" color="text.secondary">
                            {totalDaysInMonth - (watch("workingDays") || 0)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} sm={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" color="text.secondary">Attendance %</Typography>
                          <Typography variant="h6" color={(calculation?.attendancePercentage ?? 0) > 75
                            ? 'success.main'
                            : 'warning.main'}>
                            {(calculation?.attendancePercentage ?? 0).toFixed(1)}%

                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Attendance Inputs */}
              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="presentDays"
                  control={control}
                  rules={{
                    required: 'Present days is required',
                    min: { value: 0, message: 'Cannot be negative' },
                    max: { value: totalDaysInMonth, message: `Cannot exceed ${totalDaysInMonth} days` }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Present Days *"
                      type="number"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: totalDaysInMonth,
                          step: 0.5
                        },
                        startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>✓</Box>
                      }}
                      onChange={(e) => {
                        const val = Math.max(0, parseFloat(e.target.value) || 0);
                        field.onChange(val);
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="paidLeaves"
                  control={control}
                  rules={{
                    min: { value: 0, message: 'Cannot be negative' },
                    max: { value: totalDaysInMonth, message: `Cannot exceed ${totalDaysInMonth} days` }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Paid Leaves"
                      type="number"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: totalDaysInMonth
                        },
                        startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>🌴</Box>
                      }}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        field.onChange(val);
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="holidays"
                  control={control}
                  rules={{
                    min: { value: 0, message: 'Cannot be negative' },
                    max: { value: totalDaysInMonth, message: `Cannot exceed ${totalDaysInMonth} days` }
                  }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Holidays"
                      type="number"
                      fullWidth
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message || "Public/company holidays"}
                      InputProps={{
                        inputProps: {
                          min: 0,
                          max: totalDaysInMonth
                        },
                        startAdornment: <Box sx={{ mr: 1, color: 'text.secondary' }}>🎉</Box>
                      }}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        field.onChange(val);
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Calculated Fields */}
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Absent Days"
                  value={absentDays}
                  fullWidth
                  disabled
                  InputProps={{
                    startAdornment: <EventBusy fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                  helperText="Auto-calculated: Total Days - (Present + Paid Leaves + Holidays)"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="workingDays"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Working Days"
                      type="number"
                      fullWidth
                      disabled
                      helperText="Total days excluding weekends"
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Controller
                  name="overtimeHours"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Overtime Hours"
                      type="number"
                      fullWidth
                      helperText="Extra hours worked (2x rate)"
                      InputProps={{
                        inputProps: { min: 0 },
                        endAdornment: <Box sx={{ ml: 1, color: 'text.secondary' }}>hours</Box>
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Quick Stats */}
              <Grid item xs={12}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Quick Stats
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Chip
                            label="Present"
                            size="small"
                            color="success"
                            variant="outlined"
                            sx={{ mb: 0.5 }}
                          />
                          <Typography variant="body2">
                            {watchPresentDays || 0} days
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Chip
                            label="Leaves"
                            size="small"
                            color="info"
                            variant="outlined"
                            sx={{ mb: 0.5 }}
                          />
                          <Typography variant="body2">
                            {watchPaidLeaves || 0} days
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={4}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Chip
                            label="Absent"
                            size="small"
                            color="error"
                            variant="outlined"
                            sx={{ mb: 0.5 }}
                          />
                          <Typography variant="body2">
                            {absentDays} days
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {calculation && (
              <Alert severity={calculation.attendancePercentage > 75 ? "success" : "warning"} sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>Attendance Summary:</strong> {calculation.attendancePercentage.toFixed(1)}% attendance |
                  <strong> Effective Working:</strong> {watchPresentDays} present + {watchPaidLeaves} paid leaves = {watchPresentDays + watchPaidLeaves} days
                </Typography>
                {absentDays > 0 && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Note:</strong> {absentDays} absent day(s) will be deducted from basic salary
                  </Typography>
                )}
              </Alert>
            )}
          </Paper>
        );

      case 2:
        return (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calculate /> Salary Calculation Preview
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Recalculate">
                  <IconButton onClick={calculateSalary} size="small">
                    <Refresh />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Toggle Preview">
                  <IconButton onClick={() => setPreviewMode(!previewMode)} size="small">
                    <Visibility />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            {calculation ? (
              <>
                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Total Earnings
                        </Typography>
                        <Typography variant="h5" color="success.main" gutterBottom>
                          {formatCurrency(calculation.totalEarnings)}
                        </Typography>
                        <Typography variant="caption">
                          {calculation.components.filter((c: ICalculatedComponent) => {
                            const name = c.name.toLowerCase();
                            return !name.includes('deduction') &&
                              !name.includes('tax') &&
                              !name.includes('pf') &&
                              !name.includes('esic');
                          }).length} earning components
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Total Deductions
                        </Typography>
                        <Typography variant="h5" color="error.main" gutterBottom>
                          {formatCurrency(calculation.totalDeductions)}
                        </Typography>
                        <Typography variant="caption">
                          {calculation.components.filter((c: ICalculatedComponent) => {
                            const name = c.name.toLowerCase();
                            return name.includes('deduction') ||
                              name.includes('tax') ||
                              name.includes('pf') ||
                              name.includes('esic');
                          }).length} deduction components
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Net Salary
                        </Typography>
                        <Typography variant="h5" color="primary.main" gutterBottom>
                          {formatCurrency(calculation.netSalary)}
                        </Typography>
                        <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                          {numberToWords(calculation.netSalary)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>

                {/* Attendance Impact */}
                {absentDays > 0 && (
                  <Alert severity="warning" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      <strong>Attendance Impact:</strong> {absentDays} absent day(s) have been deducted from basic salary.
                      Daily rate: {formatCurrency(calculation.basic / totalDaysInMonth)} × {absentDays} days = {formatCurrency((calculation.basic / totalDaysInMonth) * absentDays)}
                    </Typography>
                  </Alert>
                )}

                {/* Detailed Breakdown */}
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'grey.50' }}>
                        <TableCell><strong>Component</strong></TableCell>
                        <TableCell><strong>Type</strong></TableCell>
                        <TableCell><strong>Calculation Basis</strong></TableCell>
                        <TableCell align="right"><strong>Amount</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calculation.components.map((component: ICalculatedComponent, index: number) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {component.name}
                              {!component.isActive && (
                                <Chip label="Inactive" size="small" color="default" />
                              )}
                              {component.name.toLowerCase().includes('basic') && absentDays > 0 && (
                                <Chip label="Pro-rated" size="small" color="warning" />
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
                          <TableCell>
                            {component.calculationType === 'Percentage'
                              ? `${component.value}% of Basic (${formatCurrency(calculation.basic)})`
                              : `Fixed: ${component.value}${component.calculated === 'Annually' ? '/year' : '/month'}`}
                            {component.name.toLowerCase().includes('basic') && absentDays > 0 && (
                              <Typography variant="caption" color="warning.main" display="block">
                                - {formatCurrency((calculation.basic / totalDaysInMonth) * absentDays)} for {absentDays} absent days
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={component.name.toLowerCase().includes('deduction') ? 'error.main' : 'success.main'}
                              fontWeight={500}
                            >
                              {component.name.toLowerCase().includes('deduction') ? '-' : '+'}
                              {formatCurrency(component.calculatedAmount)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}

                      {/* Overtime Row */}
                      {calculation.overtimeAmount > 0 && (
                        <TableRow>
                          <TableCell colSpan={3}>
                            <Typography variant="body2" fontWeight={600}>
                              Overtime ({watchOvertimeHours} hours @ 2x rate)
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Hourly rate: {formatCurrency(calculation.basic / ((watchPresentDays + watchPaidLeaves) * 8))}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" color="success.main" fontWeight={600}>
                              +{formatCurrency(calculation.overtimeAmount)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}

                      {/* Totals Row */}
                      <TableRow sx={{ borderTop: '2px solid', borderColor: 'divider', backgroundColor: 'primary.50' }}>
                        <TableCell colSpan={3}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            Net Salary Payable
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {numberToWords(calculation.netSalary)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6" color="primary.main" fontWeight={600}>
                            {formatCurrency(calculation.netSalary)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Additional Information */}
                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid item xs={12} md={6}>
                    <Alert severity="info">
                      <Typography variant="body2">
                        <strong>Payment Details:</strong>
                        <br />
                        • Payment Date: {new Date(watchYear, watchMonth - 1, 5).toLocaleDateString()}
                        <br />
                        • Bank: {employee.bankName}
                        <br />
                        • Account: {employee.bankAccount}
                      </Typography>
                    </Alert>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Alert severity="success">
                      <Typography variant="body2">
                        <strong>Attendance Summary:</strong>
                        <br />
                        • Present: {watchPresentDays} days
                        <br />
                        • Paid Leaves: {watchPaidLeaves} days
                        <br />
                        • Holidays: {watchHolidays} days
                        <br />
                        • Absent: {absentDays} days
                        <br />
                        • Attendance: {calculation.attendancePercentage.toFixed(1)}%
                      </Typography>
                    </Alert>
                  </Grid>
                </Grid>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Calculate sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
                <Typography color="text.secondary">
                  Calculate salary to see preview
                </Typography>
              </Box>
            )}
          </Paper>
        );

      default:
        return null;
    }
  };

  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit(onSubmit)}>
        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<Edit />}
            variant="outlined"
          >
            Back
          </Button>

          <Stack direction="row" spacing={2}>
            {activeStep === steps.length - 1 ? (
              <>
                <Button
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() => {
                    calculateSalary();
                    setPreviewMode(true);
                  }}
                  disabled={!calculation}
                >
                  Preview PDF
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<Download />}
                  disabled={!calculation}
                  className="!text-white"
                >
                  Generate & Download PDF
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                startIcon={<CheckCircle />}
              >
                Continue
              </Button>
            )}
          </Stack>
        </Box>
      </form>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 4, justifyContent: 'center' }}>
        <Tooltip title="Print Slip">
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={() => window.print()}
            disabled={!calculation}
            size="small"
          >
            Print
          </Button>
        </Tooltip>
        <Tooltip title="Email to Employee">
          <Button
            variant="outlined"
            startIcon={<Mail />}
            disabled={!calculation}
            onClick={() => toast.info('Email feature will be implemented soon')}
            size="small"
          >
            Email
          </Button>
        </Tooltip>
        <Tooltip title="Save as Draft">
          <Button
            variant="outlined"
            startIcon={<Save />}
            onClick={() => toast.success('Saved as draft')}
            size="small"
          >
            Save Draft
          </Button>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default SalarySlipGenerator;