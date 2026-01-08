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
  Grid,
  Chip,
  Stack,
  Autocomplete,
  Button
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import { statePropsType } from "@/interface/common.interface";
import FormLabel from "@/components/elements/SharedInputs/FormLabel";

// Define attendance report form interface
interface IAttendanceReportForm {
  reportName: string;
  reportType: string;
  format: string;
  periodType: string;
  customStartDate?: Date;
  customEndDate?: Date;
  includeDepartments: boolean;
  includeEmployees: boolean;
  includeSummary: boolean;
  includeCharts: boolean;
  includeComparative: boolean;
  exportType: string;
  scheduleType: string;
  scheduleFrequency?: string;
  emailRecipients?: string;
  selectedDepartments: string[];
  selectedEmployees: string[];
  attendanceMetrics: string[];
}

// Mock dropdown data
const reportTypeOptions = [
  { value: "Daily", label: "Daily Attendance Report" },
  { value: "Weekly", label: "Weekly Attendance Summary" },
  { value: "Monthly", label: "Monthly Attendance Analysis" },
  { value: "Quarterly", label: "Quarterly Attendance Review" },
  { value: "Yearly", label: "Yearly Attendance Report" },
  { value: "Department", label: "Department-wise Attendance" },
  { value: "Employee", label: "Employee Attendance History" },
  { value: "Late Arrivals", label: "Late Arrival Analysis" },
  { value: "Absenteeism", label: "Absenteeism Report" },
  { value: "Overtime", label: "Overtime Analysis" },
  { value: "Leave", label: "Leave Utilization Report" },
  { value: "Custom", label: "Custom Report" },
];

const formatOptions = [
  { value: "PDF", label: "PDF Document" },
  { value: "Excel", label: "Excel Spreadsheet" },
  { value: "CSV", label: "CSV File" },
  { value: "HTML", label: "HTML Report" },
  { value: "PowerPoint", label: "PowerPoint Presentation" },
];

const periodTypeOptions = [
  { value: "today", label: "Today" },
  { value: "yesterday", label: "Yesterday" },
  { value: "this_week", label: "This Week" },
  { value: "last_week", label: "Last Week" },
  { value: "this_month", label: "This Month" },
  { value: "last_month", label: "Last Month" },
  { value: "this_quarter", label: "This Quarter" },
  { value: "last_quarter", label: "Last Quarter" },
  { value: "this_year", label: "This Year" },
  { value: "custom", label: "Custom Period" },
];

const departmentOptions = [
  "Engineering",
  "Sales", 
  "Marketing",
  "Operations",
  "Finance",
  "Human Resources",
  "IT",
  "Customer Support",
  "Research & Development",
  "Legal"
];

const employeeOptions = [
  "John Smith",
  "Sarah Johnson",
  "Mike Williams",
  "Emily Brown",
  "David Miller",
  "Lisa Taylor",
  "Robert Davis",
  "Amanda Wilson",
  "Thomas Anderson",
  "Jennifer Moore"
];

const metricOptions = [
  "Attendance Rate",
  "Present Count",
  "Absent Count",
  "Late Arrivals",
  "Early Leaves",
  "Overtime Hours",
  "Average Hours",
  "Leave Balance",
  "Shift Compliance",
  "Break Times"
];

const scheduleFrequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
];

const exportTypeOptions = [
  { value: "export", label: "Export Only" },
  { value: "email", label: "Email Only" },
  { value: "both", label: "Export and Email" },
];

const GenerateAttendanceReportModal = ({ open, setOpen }: statePropsType) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IAttendanceReportForm>({
    defaultValues: {
      reportName: "",
      reportType: "Monthly",
      format: "PDF",
      periodType: "this_month",
      includeDepartments: true,
      includeEmployees: false,
      includeSummary: true,
      includeCharts: true,
      includeComparative: false,
      exportType: "export",
      scheduleType: "once",
      selectedDepartments: [],
      selectedEmployees: [],
      attendanceMetrics: ["Attendance Rate", "Present Count", "Absent Count", "Late Arrivals"]
    }
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedEmps, setSelectedEmps] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["Attendance Rate", "Present Count", "Absent Count", "Late Arrivals"]);
  
  const watchPeriodType = watch("periodType");
  const watchScheduleType = watch("scheduleType");
  const watchReportType = watch("reportType");
  const watchExportType = watch("exportType"); // Added this line
  
  const handleToggle = () => setOpen(!open);

  // Handle submit form
  const onSubmit = async (data: IAttendanceReportForm) => {
    setIsGenerating(true);
    setProgress(0);
    
    // Simulate report generation with progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          // Simulate API call
          toast.success("Attendance report generated successfully!");
          reset();
          setTimeout(() => setOpen(false), 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      // API call would go here
      console.log("Generating attendance report with data:", {
        ...data,
        selectedDepartments: selectedDepts,
        selectedEmployees: selectedEmps,
        attendanceMetrics: selectedMetrics
      });
    } catch (error: any) {
      clearInterval(interval);
      setIsGenerating(false);
      toast.error(
        error?.message || "An error occurred while generating the attendance report. Please try again!"
      );
    }
  };

  const handleDepartmentToggle = (dept: string) => {
    setSelectedDepts(prev => 
      prev.includes(dept) 
        ? prev.filter(d => d !== dept)
        : [...prev, dept]
    );
  };

  const handleEmployeeToggle = (emp: string) => {
    setSelectedEmps(prev => 
      prev.includes(emp) 
        ? prev.filter(e => e !== emp)
        : [...prev, emp]
    );
  };

  const handleMetricToggle = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const selectAllDepartments = () => {
    if (selectedDepts.length === departmentOptions.length) {
      setSelectedDepts([]);
    } else {
      setSelectedDepts([...departmentOptions]);
    }
  };

  const selectAllMetrics = () => {
    if (selectedMetrics.length === metricOptions.length) {
      setSelectedMetrics([]);
    } else {
      setSelectedMetrics([...metricOptions]);
    }
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Generate Attendance Report</h5>
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
                Generating Attendance Report...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we compile the attendance data
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
                    id="periodType"
                    label="Time Period"
                    options={periodTypeOptions}
                    control={control}
                    error={errors.periodType}
                  />
                </Grid>
              </Grid>
              
              {watchPeriodType === "custom" && (
                <>
                  <Divider className="my-6" />
                  <Typography variant="h6" className="font-medium mb-4">
                    Custom Date Range
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="customStartDate"
                        control={control}
                        render={({ field }) => (
                          <div className="form__input-box">
                            <FormLabel label="Start Date" id="customStartDate" />
                            <div className="datepicker-style">
                              <input
                                type="date"
                                id="customStartDate"
                                className="form-control"
                                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                onChange={(e) => field.onChange(new Date(e.target.value))}
                              />
                            </div>
                          </div>
                        )}
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Controller
                        name="customEndDate"
                        control={control}
                        render={({ field }) => (
                          <div className="form__input-box">
                            <FormLabel label="End Date" id="customEndDate" />
                            <div className="datepicker-style">
                              <input
                                type="date"
                                id="customEndDate"
                                className="form-control"
                                value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                                onChange={(e) => field.onChange(new Date(e.target.value))}
                              />
                            </div>
                          </div>
                        )}
                      />
                    </Grid>
                  </Grid>
                </>
              )}
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Scope & Filters
              </Typography>
              
              {(watchReportType === "Department" || watchReportType === "Custom") && (
                <Box className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Typography variant="subtitle2">Select Departments</Typography>
                    <Button size="small" onClick={selectAllDepartments}>
                      {selectedDepts.length === departmentOptions.length ? "Deselect All" : "Select All"}
                    </Button>
                  </div>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {departmentOptions.map((dept) => (
                      <Chip
                        key={dept}
                        label={dept}
                        onClick={() => handleDepartmentToggle(dept)}
                        color={selectedDepts.includes(dept) ? "primary" : "default"}
                        variant={selectedDepts.includes(dept) ? "filled" : "outlined"}
                        className="mb-1"
                      />
                    ))}
                  </Stack>
                </Box>
              )}
              
              {(watchReportType === "Employee" || watchReportType === "Custom") && (
                <Box className="mb-4">
                  <Typography variant="subtitle2" className="mb-2">Select Employees (Optional)</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {employeeOptions.map((emp) => (
                      <Chip
                        key={emp}
                        label={emp}
                        onClick={() => handleEmployeeToggle(emp)}
                        color={selectedEmps.includes(emp) ? "primary" : "default"}
                        variant={selectedEmps.includes(emp) ? "filled" : "outlined"}
                        className="mb-1"
                      />
                    ))}
                  </Stack>
                </Box>
              )}
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Metrics & Data Points
              </Typography>
              
              <Box className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <Typography variant="subtitle2">Select Metrics to Include</Typography>
                  <Button size="small" onClick={selectAllMetrics}>
                    {selectedMetrics.length === metricOptions.length ? "Deselect All" : "Select All"}
                  </Button>
                </div>
                <Grid container spacing={1}>
                  {metricOptions.map((metric) => (
                    <Grid item xs={12} sm={6} md={4} key={metric}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedMetrics.includes(metric)}
                            onChange={() => handleMetricToggle(metric)}
                            size="small"
                          />
                        }
                        label={metric}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Report Options
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="includeSummary"
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
                    label="Include Executive Summary"
                  />
                </Grid>
                
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
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Output & Delivery
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="exportType"
                    label="Export Type"
                    options={exportTypeOptions}
                    control={control}
                    error={errors.exportType}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
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
                
                {(watchExportType === "email" || watchExportType === "both") && ( // Fixed the condition here
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
                Generate Attendance Report
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GenerateAttendanceReportModal;