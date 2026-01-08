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
import { IPerformanceReportForm } from "./performance.interface";

// Mock dropdown data
const reportTypeOptions = [
  { value: "Quarterly Review", label: "Quarterly Performance Review" },
  { value: "Annual Review", label: "Annual Performance Assessment" },
  { value: "360 Feedback", label: "360-Degree Feedback" },
  { value: "Competency Assessment", label: "Competency Assessment" },
  { value: "Goal Tracking", label: "Goal Achievement Tracking" },
  { value: "Leadership Assessment", label: "Leadership Assessment" },
  { value: "Performance Scorecard", label: "Performance Scorecard" },
  { value: "Talent Review", label: "Talent Review" },
  { value: "Development Plan", label: "Development Plan Summary" },
  { value: "Succession Planning", label: "Succession Planning Report" },
];

const formatOptions = [
  { value: "PDF", label: "PDF Document" },
  { value: "Excel", label: "Excel Spreadsheet" },
  { value: "PowerPoint", label: "PowerPoint Presentation" },
  { value: "HTML", label: "HTML Report" },
  { value: "CSV", label: "CSV Data Export" },
];

const evaluationPeriodOptions = [
  { value: "Q1 2024", label: "Q1 2024" },
  { value: "Q2 2024", label: "Q2 2024" },
  { value: "Q3 2024", label: "Q3 2024" },
  { value: "Q4 2024", label: "Q4 2024" },
  { value: "2024", label: "Full Year 2024" },
  { value: "custom", label: "Custom Period" },
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
  { value: "leadership", label: "Leadership" },
];

const employeeLevelOptions = [
  { value: "all", label: "All Levels" },
  { value: "entry", label: "Entry Level" },
  { value: "mid", label: "Mid Level" },
  { value: "senior", label: "Senior Level" },
  { value: "lead", label: "Team Lead" },
  { value: "manager", label: "Manager" },
  { value: "director", label: "Director" },
  { value: "executive", label: "Executive" },
];

const ratingScaleOptions = [
  { value: "5-point", label: "5-Point Scale (1-5)" },
  { value: "10-point", label: "10-Point Scale (1-10)" },
  { value: "percentage", label: "Percentage (0-100%)" },
  { value: "letter-grade", label: "Letter Grade (A-F)" },
  { value: "meets-exceeds", label: "Meets/Exceeds Expectations" },
];

const scheduleFrequencyOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "semi-annually", label: "Semi-Annually" },
  { value: "annually", label: "Annually" },
];

const GeneratePerformanceReportModal = ({ open, setOpen }: statePropsType) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<IPerformanceReportForm>({
    defaultValues: {
      reportName: "",
      reportType: "Quarterly Review",
      format: "PDF",
      evaluationPeriod: "Q1 2024",
      department: "all",
      employeeLevel: "all",
      include360Feedback: true,
      includeCompetencies: true,
      includeDevelopmentPlans: true,
      includeComparativeData: true,
      ratingScale: "5-point",
      scheduleType: "once",
    }
  });
  
  const [customStartDate, setCustomStartDate] = useState<Date | null>(new Date());
  const [customEndDate, setCustomEndDate] = useState<Date | null>(new Date());
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const watchEvaluationPeriod = watch("evaluationPeriod");
  const watchScheduleType = watch("scheduleType");
  
  const handleToggle = () => setOpen(!open);

  const onSubmit = async (data: IPerformanceReportForm) => {
    setIsGenerating(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          
          toast.success("Performance report generated successfully!");
          reset();
          setTimeout(() => setOpen(false), 2000);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    try {
      console.log("Generating performance report with data:", data);
    } catch (error: any) {
      clearInterval(interval);
      setIsGenerating(false);
      toast.error(
        error?.message || "An error occurred while generating the performance report. Please try again!"
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Generate Performance Report</h5>
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
                Generating Performance Report...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we analyze performance data and generate your report
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
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
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
                
                <Grid item xs={12} md={4}>
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
                    id="reportType"
                    label="Report Type"
                    options={reportTypeOptions}
                    control={control}
                    error={errors.reportType}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="ratingScale"
                    label="Rating Scale"
                    options={ratingScaleOptions}
                    control={control}
                    error={errors.ratingScale}
                  />
                </Grid>
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Evaluation Period
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <SelectBox
                    id="evaluationPeriod"
                    label="Evaluation Period"
                    options={evaluationPeriodOptions}
                    control={control}
                    error={errors.evaluationPeriod}
                  />
                </Grid>
                
                {watchEvaluationPeriod === "custom" && (
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
                    id="employeeLevel"
                    label="Employee Level"
                    options={employeeLevelOptions}
                    control={control}
                    error={errors.employeeLevel}
                  />
                </Grid>
              </Grid>
              
              <Divider className="my-6" />
              
              <Typography variant="h6" className="font-medium mb-4">
                Report Content Options
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="include360Feedback"
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
                    label="360° Feedback"
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="includeCompetencies"
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
                    label="Competency Scores"
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="includeDevelopmentPlans"
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
                    label="Development Plans"
                  />
                </Grid>
                
                <Grid item xs={12} md={3}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="includeComparativeData"
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
                    label="Comparative Data"
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
                      label="Email Recipients (comma separated)"
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
                Generate Performance Report
              </button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GeneratePerformanceReportModal;