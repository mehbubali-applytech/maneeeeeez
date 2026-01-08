"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Box,
  Typography,
  Divider,
  Slider,
  Grid
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import { statePropsType } from "@/interface/common.interface";
import DatePicker from "react-datepicker";
import FormLabel from "@/components/elements/SharedInputs/FormLabel";

// Define finance report form interface
interface IFinanceReportForm {
  reportName: string;
  reportType: string;
  format: string;
  periodType: string;
  customStartDate?: Date;
  customEndDate?: Date;
  currency: string;
  includeCharts: boolean;
  includeComparative: boolean;
  includeForecast: boolean;
  scheduleType: string;
  scheduleFrequency?: string;
  emailRecipients?: string;
  department?: string;
  profitCenter?: string;
}

// Mock dropdown data
const reportTypeOptions = [
  { value: "P&L Statement", label: "Profit & Loss Statement" },
  { value: "Balance Sheet", label: "Balance Sheet" },
  { value: "Cash Flow", label: "Cash Flow Statement" },
  { value: "AR Aging", label: "Accounts Receivable Aging" },
  { value: "AP Aging", label: "Accounts Payable Aging" },
  { value: "Budget Analysis", label: "Budget vs Actual Analysis" },
  { value: "Revenue Analysis", label: "Revenue Analysis" },
  { value: "Expense Analysis", label: "Expense Analysis" },
  { value: "Financial Ratios", label: "Financial Ratios Analysis" },
  { value: "Tax Report", label: "Tax Compliance Report" },
  { value: "Variance Analysis", label: "Variance Analysis" },
  { value: "Consolidated", label: "Consolidated Financials" },
];

const formatOptions = [
  { value: "PDF", label: "PDF Document" },
  { value: "Excel", label: "Excel Spreadsheet" },
  { value: "CSV", label: "CSV File" },
  { value: "HTML", label: "HTML Report" },
  { value: "PowerPoint", label: "PowerPoint Presentation" },
];

const periodTypeOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
  { value: "ytd", label: "Year-to-Date" },
  { value: "custom", label: "Custom Period" },
];

const currencyOptions = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
  { value: "INR", label: "Indian Rupee (₹)" },
  { value: "JPY", label: "Japanese Yen (¥)" },
  { value: "CAD", label: "Canadian Dollar (C$)" },
  { value: "AUD", label: "Australian Dollar (A$)" },
];

const scheduleFrequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const departmentOptions = [
  { value: "all", label: "All Departments" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "engineering", label: "Engineering" },
  { value: "operations", label: "Operations" },
  { value: "finance", label: "Finance" },
  { value: "hr", label: "Human Resources" },
  { value: "it", label: "IT" },
];

const profitCenterOptions = [
  { value: "all", label: "All Profit Centers" },
  { value: "north_america", label: "North America" },
  { value: "europe", label: "Europe" },
  { value: "asia_pacific", label: "Asia Pacific" },
  { value: "emea", label: "EMEA" },
  { value: "latin_america", label: "Latin America" },
];

const GenerateFinanceReportModal = ({ open, setOpen }: statePropsType) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IFinanceReportForm>({
    defaultValues: {
      reportName: "",
      reportType: "P&L Statement",
      format: "PDF",
      periodType: "monthly",
      currency: "USD",
      includeCharts: true,
      includeComparative: true,
      includeForecast: false,
      scheduleType: "once",
      department: "all",
      profitCenter: "all",
    }
  });
  
  const [customStartDate, setCustomStartDate] = useState<Date | null>(new Date());
  const [customEndDate, setCustomEndDate] = useState<Date | null>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const watchPeriodType = watch("periodType");
  const watchScheduleType = watch("scheduleType");
  
  const handleToggle = () => setOpen(!open);

  // Handle submit form
  const onSubmit = async (data: IFinanceReportForm) => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate report generation with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          // Simulate API call
          toast.success("Finance report generated successfully!");
          reset();
          setTimeout(() => setOpen(false), 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      // API call would go here
      console.log("Generating finance report with data:", data);
    } catch (error: any) {
      clearInterval(interval);
      setIsGenerating(false);
      toast.error(
        error?.message || "An error occurred while generating the finance report. Please try again!"
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Generate Finance Report</h5>
          <button onClick={handleToggle} type="button" className="bd-btn-close">
            <i className="fa-solid fa-xmark-large"></i>
          </button>
        </div>
      </DialogTitle>
      
      <DialogContent className="common-scrollbar overflow-y-auto">
        {isGenerating ? (
          <div className="card__wrapper text-center py-8">
            <div className="mb-4">
              <Typography variant="h6" className="font-medium mb-2">
                Generating Finance Report...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we generate your financial report
              </Typography>
            </div>
            
            <Box sx={{ width: '100%', mb: 2 }}>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <Typography variant="body2" className="mt-2">
                {progress}% Complete
              </Typography>
            </Box>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card__wrapper">
              <Typography variant="h6" className="font-medium mb-4">
                Basic Configuration
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InputField
                    label="Report Name"
                    id="reportName"
                    type="text"
                    register={register("reportName", {
                      required: "Report name is required",
                    })}
                    error={errors.reportName}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="reportType"
                    label="Report Type"
                    options={reportTypeOptions}
                    control={control}
                    error={errors.reportType}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="format"
                    label="Output Format"
                    options={formatOptions}
                    control={control}
                    error={errors.format}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="currency"
                    label="Currency"
                    options={currencyOptions}
                    control={control}
                    error={errors.currency}
                  />
                </Grid>
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Period & Date Range
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="periodType"
                    label="Period Type"
                    options={periodTypeOptions}
                    control={control}
                    error={errors.periodType}
                  />
                </Grid>
                
                {watchPeriodType === "custom" && (
                  <>
                    <Grid item xs={12} md={3}>
                      <FormLabel label="Start Date" id="customStartDate" />
                      <div className="datepicker-style">
                        <DatePicker
                          id="customStartDate"
                          selected={customStartDate}
                          onChange={(date) => setCustomStartDate(date)}
                          showYearDropdown
                          showMonthDropdown
                          useShortMonthInDropdown
                          showPopperArrow={false}
                          peekNextMonth
                          dropdownMode="select"
                          isClearable
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Start date"
                          className="w-full"
                        />
                      </div>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <FormLabel label="End Date" id="customEndDate" />
                      <div className="datepicker-style">
                        <DatePicker
                          id="customEndDate"
                          selected={customEndDate}
                          onChange={(date) => setCustomEndDate(date)}
                          showYearDropdown
                          showMonthDropdown
                          useShortMonthInDropdown
                          showPopperArrow={false}
                          peekNextMonth
                          dropdownMode="select"
                          isClearable
                          dateFormat="dd/MM/yyyy"
                          placeholderText="End date"
                          className="w-full"
                        />
                      </div>
                    </Grid>
                  </>
                )}
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Scope & Filters
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="department"
                    label="Department"
                    options={departmentOptions}
                    control={control}
                    error={errors.department}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="profitCenter"
                    label="Profit Center"
                    options={profitCenterOptions}
                    control={control}
                    error={errors.profitCenter}
                  />
                </Grid>
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Report Options
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="includeCharts"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            checked={field.value}
                            color="primary"
                          />
                        )}
                      />
                    }
                    label="Include Charts & Graphs"
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="includeComparative"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            checked={field.value}
                            color="primary"
                          />
                        )}
                      />
                    }
                    label="Include Comparative Analysis"
                  />
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="includeForecast"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            checked={field.value}
                            color="primary"
                          />
                        )}
                      />
                    }
                    label="Include Forecast Projections"
                  />
                </Grid>
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Scheduling Options
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Controller
                    name="scheduleType"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup {...field} row>
                        <FormControlLabel value="once" control={<Radio />} label="Generate Once" />
                        <FormControlLabel value="schedule" control={<Radio />} label="Schedule Recurring" />
                      </RadioGroup>
                    )}
                  />
                </Grid>
                
                {watchScheduleType === "schedule" && (
                  <Grid item xs={12} md={6}>
                    <SelectBox
                      id="scheduleFrequency"
                      label="Frequency"
                      options={scheduleFrequencyOptions}
                      control={control}
                      error={errors.scheduleFrequency}
                    />
                  </Grid>
                )}
                
                {watchScheduleType === "schedule" && (
                  <Grid item xs={12} md={6}>
                    <InputField
                      label="Email Recipients"
                      id="emailRecipients"
                      type="text"
                      register={register("emailRecipients")}
                      error={errors.emailRecipients}
                    />
                  </Grid>
                )}
              </Grid>
            </div>
            
            <div className="submit__btn text-center mt-6">
              <button type="submit" className="btn btn-primary">
                Generate Finance Report
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenerateFinanceReportModal;