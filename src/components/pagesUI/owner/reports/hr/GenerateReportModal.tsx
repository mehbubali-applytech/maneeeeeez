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
  Slider
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import { statePropsType } from "@/interface/common.interface";
import DatePicker from "react-datepicker";
import FormLabel from "@/components/elements/SharedInputs/FormLabel";

// Define report form interface
interface IReportForm {
  reportName: string;
  reportType: string;
  format: string;
  dateRange: string;
  customStartDate?: Date;
  customEndDate?: Date;
  department?: string;
  includeCharts: boolean;
  includeDetails: boolean;
  scheduleType: string;
  scheduleFrequency?: string;
  emailRecipients?: string;
}

// Mock dropdown data
const reportTypeOptions = [
  { value: "Attendance", label: "Attendance Report" },
  { value: "Payroll", label: "Payroll Summary" },
  { value: "Leave", label: "Leave Balance" },
  { value: "Performance", label: "Performance Review" },
  { value: "Recruitment", label: "Recruitment Metrics" },
  { value: "Training", label: "Training Completion" },
  { value: "Analytics", label: "HR Analytics" },
  { value: "Compliance", label: "Compliance Audit" },
  { value: "Benefits", label: "Benefits Summary" },
  { value: "Turnover", label: "Employee Turnover" },
];

const formatOptions = [
  { value: "PDF", label: "PDF Document" },
  { value: "Excel", label: "Excel Spreadsheet" },
  { value: "CSV", label: "CSV File" },
  { value: "HTML", label: "HTML Report" },
];

const dateRangeOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "thisWeek", label: "This Week" },
  { value: "lastWeek", label: "Last Week" },
  { value: "thisMonth", label: "This Month" },
  { value: "lastMonth", label: "Last Month" },
  { value: "thisQuarter", label: "This Quarter" },
  { value: "lastQuarter", label: "Last Quarter" },
  { value: "thisYear", label: "This Year" },
  { value: "custom", label: "Custom Date Range" },
];

const departmentOptions = [
  { value: "all", label: "All Departments" },
  { value: "sales", label: "Sales" },
  { value: "marketing", label: "Marketing" },
  { value: "engineering", label: "Engineering" },
  { value: "hr", label: "Human Resources" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "it", label: "IT" },
  { value: "customerService", label: "Customer Service" },
];

const scheduleFrequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

const GenerateReportModal = ({ open, setOpen }: statePropsType) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IReportForm>({
    defaultValues: {
      reportName: "",
      reportType: "Attendance",
      format: "PDF",
      dateRange: "thisMonth",
      includeCharts: true,
      includeDetails: false,
      scheduleType: "once",
      department: "all",
    }
  });
  
  const [customStartDate, setCustomStartDate] = useState<Date | null>(new Date());
  const [customEndDate, setCustomEndDate] = useState<Date | null>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const watchDateRange = watch("dateRange");
  const watchScheduleType = watch("scheduleType");
  
  const handleToggle = () => setOpen(!open);

  // Handle submit form
  const onSubmit = async (data: IReportForm) => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate report generation with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          // Simulate API call
          toast.success("Report generated successfully!");
          reset();
          setTimeout(() => setOpen(false), 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      // API call would go here
      console.log("Generating report with data:", data);
    } catch (error: any) {
      clearInterval(interval);
      setIsGenerating(false);
      toast.error(
        error?.message || "An error occurred while generating the report. Please try again!"
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Generate HR Report</h5>
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
                Generating Report...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we generate your report
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
                Report Configuration
              </Typography>
              
              <div className="grid grid-cols-12 gap-y-6 gap-x-6 maxXs:gap-x-0 justify-center items-center">
                <div className="col-span-12 md:col-span-6">
                  <InputField
                    label="Report Name"
                    id="reportName"
                    type="text"
                    register={register("reportName", {
                      required: "Report name is required",
                    })}
                    error={errors.reportName}
                  />
                </div>
                
                <div className="col-span-12 md:col-span-6">
                  <SelectBox
                    id="reportType"
                    label="Report Type"
                    options={reportTypeOptions}
                    control={control}
                    error={errors.reportType}
                  />
                </div>
                
                <div className="col-span-12 md:col-span-6">
                  <SelectBox
                    id="format"
                    label="Output Format"
                    options={formatOptions}
                    control={control}
                    error={errors.format}
                  />
                </div>
                
                <div className="col-span-12 md:col-span-6">
                  <SelectBox
                    id="department"
                    label="Department"
                    options={departmentOptions}
                    control={control}
                    error={errors.department}
                  />
                </div>
              </div>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Date Range
              </Typography>
              
              <div className="grid grid-cols-12 gap-y-6 gap-x-6 maxXs:gap-x-0 justify-center items-center">
                <div className="col-span-12 md:col-span-6">
                  <SelectBox
                    id="dateRange"
                    label="Select Date Range"
                    options={dateRangeOptions}
                    control={control}
                    error={errors.dateRange}
                  />
                </div>
                
                {watchDateRange === "custom" && (
                  <>
                    <div className="col-span-12 md:col-span-3">
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
                    </div>
                    
                    <div className="col-span-12 md:col-span-3">
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
                    </div>
                  </>
                )}
              </div>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Report Options
              </Typography>
              
              <div className="grid grid-cols-12 gap-y-4 gap-x-6 maxXs:gap-x-0">
                <div className="col-span-12 md:col-span-6">
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
                </div>
                
                <div className="col-span-12 md:col-span-6">
                  <FormControlLabel
                    control={
                      <Controller
                        name="includeDetails"
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
                    label="Include Detailed Data"
                  />
                </div>
              </div>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Scheduling Options
              </Typography>
              
              <div className="grid grid-cols-12 gap-y-6 gap-x-6 maxXs:gap-x-0 justify-center items-center">
                <div className="col-span-12">
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
                </div>
                
                {watchScheduleType === "schedule" && (
                  <div className="col-span-12 md:col-span-6">
                    <SelectBox
                      id="scheduleFrequency"
                      label="Frequency"
                      options={scheduleFrequencyOptions}
                      control={control}
                      error={errors.scheduleFrequency}
                    />
                  </div>
                )}
                
                {watchScheduleType === "schedule" && (
                  <div className="col-span-12 md:col-span-6">
                    <InputField
                      label="Email Recipients (comma separated)"
                      id="emailRecipients"
                      type="text"
                      register={register("emailRecipients")}
                      error={errors.emailRecipients}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="submit__btn text-center mt-6">
              <button type="submit" className="btn btn-primary">
                Generate Report
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenerateReportModal;