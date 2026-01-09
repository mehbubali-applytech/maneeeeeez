// ManualCorrectionModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Paper,
  Alert,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Divider,
  Autocomplete,
  FormHelperText,
  Stack
} from "@mui/material";
import {
  Close,
  AccessTime,
  CalendarMonth,
  Person,
  Upload,
  AttachFile,
  Delete,
  CheckCircle,
  Error,
  Schedule,
  Description
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { IAttendanceRecord } from "./AttendanceTypes";

interface ManualCorrectionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CorrectionFormData) => void;
  record?: IAttendanceRecord;
  mode: 'create' | 'edit';
}

interface CorrectionFormData {
  date: Date;
  employeeId: string;
  checkInTime: Date | null;
  checkOutTime: Date | null;
  reason: string;
  supportingDocuments: File[];
  correctionType: 'checkin' | 'checkout' | 'both';
  isForFuture?: boolean;
}

interface EmployeeOption {
  id: string;
  name: string;
  department: string;
  email: string;
}

  // Mock employees for autocomplete
  const employeeOptions: EmployeeOption[] = [
    { id: 'EMP001', name: 'Rajesh Kumar', department: 'Engineering', email: 'rajesh.kumar@example.com' },
    { id: 'EMP002', name: 'Priya Sharma', department: 'Marketing', email: 'priya.sharma@example.com' },
    { id: 'EMP003', name: 'Amit Patel', department: 'Sales', email: 'amit.patel@example.com' },
    { id: 'EMP004', name: 'Sneha Reddy', department: 'HR', email: 'sneha.reddy@example.com' },
    { id: 'EMP005', name: 'Vikram Singh', department: 'Engineering', email: 'vikram.singh@example.com' },
    { id: 'EMP006', name: 'Anjali Mehta', department: 'Finance', email: 'anjali.mehta@example.com' },
    { id: 'EMP007', name: 'Rahul Verma', department: 'Operations', email: 'rahul.verma@example.com' },
    { id: 'EMP008', name: 'Sonia Kapoor', department: 'Design', email: 'sonia.kapoor@example.com' },
  ];

const ManualCorrectionModal: React.FC<ManualCorrectionModalProps> = ({
  open,
  onClose,
  onSubmit,
  record,
  mode = 'create'
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [correctionType, setCorrectionType] = useState<'checkin' | 'checkout' | 'both'>('both');
  const [date, setDate] = useState<Date | null>(record ? new Date(record.date) : new Date());
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeOption | null>(null);
  const [checkInTime, setCheckInTime] = useState<Date | null>(new Date());
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(new Date());
  const [reason, setReason] = useState("");
  const [supportingDocuments, setSupportingDocuments] = useState<File[]>([]);
  const [isForFuture, setIsForFuture] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = ['Select Type', 'Enter Details', 'Provide Reason', 'Review'];



  // Reason categories for autocomplete
  const reasonCategories = [
    'System Error/Malfunction',
    'Forgot to Check-In/Out',
    'Network Issues',
    'Emergency Situation',
    'Client Meeting Outside',
    'Work From Home',
    'Travel/Field Work',
    'Hardware Failure',
    'Power Outage',
    'Personal Emergency',
    'Medical Appointment',
    'Training/Workshop',
    'Other'
  ];

  useEffect(() => {
    if (record) {
      // Find employee
      const employee = employeeOptions.find(emp => emp.id === record.employeeId);
      setSelectedEmployee(employee || null);
      setDate(new Date(record.date));
      
      // Parse times
      if (record.checkInTime) {
        const [hours, minutes] = record.checkInTime.split(':').map(Number);
        const checkInDate = new Date();
        checkInDate.setHours(hours, minutes, 0, 0);
        setCheckInTime(checkInDate);
      }
      
      if (record.checkOutTime) {
        const [hours, minutes] = record.checkOutTime.split(':').map(Number);
        const checkOutDate = new Date();
        checkOutDate.setHours(hours, minutes, 0, 0);
        setCheckOutTime(checkOutDate);
      }
      
      setReason(record.correctionRequest?.reason || "");
    } else {
      // Reset to default times
      const defaultInTime = new Date();
      defaultInTime.setHours(9, 0, 0, 0);
      setCheckInTime(defaultInTime);
      
      const defaultOutTime = new Date();
      defaultOutTime.setHours(18, 0, 0, 0);
      setCheckOutTime(defaultOutTime);
    }
  }, [record]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch(step) {
      case 0: // Select Type
        if (!correctionType) {
          newErrors.correctionType = 'Please select a correction type';
        }
        break;
        
      case 1: // Enter Details
        if (!date) {
          newErrors.date = 'Date is required';
        } else if (date > new Date() && !isForFuture) {
          newErrors.date = 'Future dates require special permission';
        }
        if (!selectedEmployee) {
          newErrors.employeeId = 'Please select an employee';
        }
        if (correctionType !== 'checkout' && !checkInTime) {
          newErrors.checkInTime = 'Check-in time is required';
        }
        if (correctionType !== 'checkin' && !checkOutTime) {
          newErrors.checkOutTime = 'Check-out time is required';
        }
        // Validate check-out is after check-in
        if (checkInTime && checkOutTime && checkOutTime <= checkInTime) {
          newErrors.checkOutTime = 'Check-out time must be after check-in time';
        }
        break;
        
      case 2: // Provide Reason
        if (!reason.trim()) {
          newErrors.reason = 'Reason is required';
        } else if (reason.length < 10) {
          newErrors.reason = 'Please provide a detailed reason (min. 10 characters)';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    if (!date || !selectedEmployee) {
      setErrors({ 
        ...(!date && { date: 'Date is required' }),
        ...(!selectedEmployee && { employeeId: 'Employee is required' })
      });
      return;
    }

    const formData: CorrectionFormData = {
      date,
      employeeId: selectedEmployee.id,
      checkInTime: correctionType !== 'checkout' ? checkInTime : null,
      checkOutTime: correctionType !== 'checkin' ? checkOutTime : null,
      reason,
      supportingDocuments,
      correctionType,
      isForFuture
    };

    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setActiveStep(0);
    setCorrectionType('both');
    setDate(record ? new Date(record.date) : new Date());
    setSelectedEmployee(null);
    
    const defaultInTime = new Date();
    defaultInTime.setHours(9, 0, 0, 0);
    setCheckInTime(defaultInTime);
    
    const defaultOutTime = new Date();
    defaultOutTime.setHours(18, 0, 0, 0);
    setCheckOutTime(defaultOutTime);
    
    setReason("");
    setSupportingDocuments([]);
    setIsForFuture(false);
    setErrors({});
    onClose();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      // Validate file types and size
      const validFiles = newFiles.filter(file => {
        const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'].includes(file.type);
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
        return isValidType && isValidSize;
      });
      setSupportingDocuments(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSupportingDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'Not set';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '—';
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const calculateHours = () => {
    if (!checkInTime || !checkOutTime) return 0;
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    return diffMs / (1000 * 60 * 60);
  };

  const renderStepContent = (step: number) => {
    switch(step) {
      case 0:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Select what you want to correct
            </Typography>
            
            <RadioGroup
              value={correctionType}
              onChange={(e) => setCorrectionType(e.target.value as any)}
            >
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  cursor: 'pointer',
                  borderColor: correctionType === 'checkin' ? 'primary.main' : 'divider',
                  bgcolor: correctionType === 'checkin' ? 'primary.50' : 'background.paper'
                }}
                onClick={() => setCorrectionType('checkin')}
              >
                <FormControlLabel
                  value="checkin"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle2">Check-In Time Only</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Correct only the check-in time
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
              
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  mb: 2, 
                  cursor: 'pointer',
                  borderColor: correctionType === 'checkout' ? 'primary.main' : 'divider',
                  bgcolor: correctionType === 'checkout' ? 'primary.50' : 'background.paper'
                }}
                onClick={() => setCorrectionType('checkout')}
              >
                <FormControlLabel
                  value="checkout"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle2">Check-Out Time Only</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Correct only the check-out time
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
              
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  cursor: 'pointer',
                  borderColor: correctionType === 'both' ? 'primary.main' : 'divider',
                  bgcolor: correctionType === 'both' ? 'primary.50' : 'background.paper'
                }}
                onClick={() => setCorrectionType('both')}
              >
                <FormControlLabel
                  value="both"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="subtitle2">Both Check-In & Check-Out</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Correct both check-in and check-out times
                      </Typography>
                    </Box>
                  }
                />
              </Paper>
            </RadioGroup>
            
            {errors.correctionType && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errors.correctionType}
              </Alert>
            )}
          </Box>
        );

      case 1:
        return (
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Autocomplete
                  options={employeeOptions}
                  getOptionLabel={(option) => `${option.name} (${option.department})`}
                  value={selectedEmployee}
                  onChange={(_, newValue) => setSelectedEmployee(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Employee *"
                      error={!!errors.employeeId}
                      helperText={errors.employeeId}
                      placeholder="Search by name, ID, or department"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Box>
                        <Typography variant="body2">
                          {option.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.department} • {option.id} • {option.email}
                        </Typography>
                      </Box>
                    </li>
                  )}
                  noOptionsText="No employees found"
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date *"
                  value={date}
                  onChange={setDate}
                  disabled={mode === 'edit'}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.date,
                      helperText: errors.date
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Radio
                      checked={isForFuture}
                      onChange={(e) => setIsForFuture(e.target.checked)}
                      size="small"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="caption" color={isForFuture ? 'warning.main' : 'text.secondary'}>
                        For future date
                      </Typography>
                      {isForFuture && (
                        <Typography variant="caption" color="warning.main" display="block">
                          Requires approval
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </Grid>
              
              {correctionType !== 'checkout' && (
                <Grid item xs={12} md={6}>
                  <TimePicker
                    label="Check-In Time *"
                    value={checkInTime}
                    onChange={setCheckInTime}
                    ampm={false}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.checkInTime,
                        helperText: errors.checkInTime,
                      }
                    }}
                  />
                </Grid>
              )}
              
              {correctionType !== 'checkin' && (
                <Grid item xs={12} md={6}>
                  <TimePicker
                    label="Check-Out Time *"
                    value={checkOutTime}
                    onChange={setCheckOutTime}
                    ampm={false}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.checkOutTime,
                        helperText: errors.checkOutTime,
                      }
                    }}
                  />
                </Grid>
              )}
              
              {checkInTime && checkOutTime && (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Stack direction="row" spacing={3} alignItems="center">
                      <Box>
                        <Typography variant="caption" color="text.secondary">Working Hours</Typography>
                        <Typography variant="h6" color="primary.main">
                          {calculateHours().toFixed(2)} hours
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Box>
                        <Typography variant="caption" color="text.secondary">Check-In</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatTime(checkInTime)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">Check-Out</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatTime(checkOutTime)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </LocalizationProvider>
        );

      case 2:
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Please provide a detailed reason for this correction
            </Typography>
            
            <Autocomplete
              freeSolo
              options={reasonCategories}
              value={reason}
              onChange={(_, newValue) => setReason(newValue || '')}
              onInputChange={(_, newInputValue) => {
                if (!reasonCategories.includes(newInputValue)) {
                  setReason(newInputValue);
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Reason for Correction *"
                  multiline
                  rows={4}
                  error={!!errors.reason}
                  helperText={errors.reason || "Select a category or type your own reason"}
                  placeholder="Select a reason or type your own..."
                />
              )}
              renderOption={(props, option) => (
                <li {...props}>
                  <Typography variant="body2">{option}</Typography>
                </li>
              )}
              sx={{ mb: 3 }}
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Supporting Documents (Optional)
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Upload screenshots, emails, or other documents to support your request (Max 5MB per file)
              </Typography>
              
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  onChange={handleFileUpload}
                  accept=".jpg,.jpeg,.png,.pdf"
                  style={{ display: 'none' }}
                />
                
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Upload Files
                </Button>
                
                <Typography variant="caption" color="text.secondary">
                  Supported: JPG, PNG, PDF
                </Typography>
              </Stack>
              
              {supportingDocuments.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Uploaded files ({supportingDocuments.length}):
                  </Typography>
                  <Stack spacing={1}>
                    {supportingDocuments.map((file, index) => (
                      <Paper 
                        key={index} 
                        variant="outlined" 
                        sx={{ 
                          p: 1.5, 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center' 
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AttachFile fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2">{file.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(file.size / 1024).toFixed(2)} KB
                            </Typography>
                          </Box>
                        </Stack>
                        <IconButton
                          size="small"
                          onClick={() => removeFile(index)}
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="caption">
                Note: All correction requests are reviewed by HR/Admin. Falsified information may lead to disciplinary action.
              </Typography>
            </Alert>
          </Box>
        );

      case 3:
        const totalHours = calculateHours();
        
        return (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Please review all details before submitting
            </Typography>
            
            <Paper variant="outlined" sx={{ p: 3, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Summary</Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Employee</Typography>
                  <Typography variant="body2">
                    {selectedEmployee?.name || 'Not selected'}
                    {selectedEmployee && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {selectedEmployee.department} • {selectedEmployee.id}
                      </Typography>
                    )}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography variant="body2">
                    {formatDate(date)}
                  </Typography>
                  {isForFuture && (
                    <Chip 
                      label="Future Date" 
                      size="small" 
                      color="warning" 
                      sx={{ mt: 0.5 }}
                    />
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Correction Type</Typography>
                  <Chip 
                    label={correctionType === 'both' ? 'Both Times' : correctionType === 'checkin' ? 'Check-In Only' : 'Check-Out Only'} 
                    size="small" 
                    color="primary"
                    icon={<Schedule />}
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Working Hours</Typography>
                  <Typography variant="body2" fontWeight={600} color="primary.main">
                    {totalHours.toFixed(2)} hours
                  </Typography>
                </Grid>
                
                {correctionType !== 'checkout' && (
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'success.50' }}>
                      <Typography variant="caption" color="text.secondary">Check-In Time</Typography>
                      <Typography variant="body1" fontWeight={600} color="success.main">
                        {formatTime(checkInTime)}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                
                {correctionType !== 'checkin' && (
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'error.50' }}>
                      <Typography variant="caption" color="text.secondary">Check-Out Time</Typography>
                      <Typography variant="body1" fontWeight={600} color="error.main">
                        {formatTime(checkOutTime)}
                      </Typography>
                    </Paper>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Reason</Typography>
                  <Paper variant="outlined" sx={{ p: 1.5, mt: 0.5, bgcolor: 'grey.50' }}>
                    <Stack direction="row" spacing={1} alignItems="flex-start">
                      <Description fontSize="small" color="action" />
                      <Typography variant="body2">
                        {reason || 'No reason provided'}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid>
                
                {supportingDocuments.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Supporting Documents</Typography>
                    <Stack spacing={1} sx={{ mt: 0.5 }}>
                      {supportingDocuments.map((file, index) => (
                        <Chip
                          key={index}
                          label={file.name}
                          size="small"
                          icon={<AttachFile />}
                          variant="outlined"
                        />
                      ))}
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </Paper>
            
            <Alert severity={isForFuture ? "warning" : "success"} icon={isForFuture ? <Error /> : <CheckCircle />}>
              <Typography variant="caption">
                {isForFuture 
                  ? "⚠️ This is a future date correction. It will require additional approval and be applied when the date arrives."
                  : "✓ This correction request will be submitted for approval. You'll be notified via email once it's reviewed."
                }
              </Typography>
            </Alert>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime color="primary" />
              <Typography variant="h6">
                {mode === 'edit' ? 'Edit Attendance Record' : 'Manual Attendance Correction'}
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel 
                  StepIconProps={{
                    sx: {
                      '& .MuiStepIcon-root': {
                        color: index < activeStep ? 'primary.main' : 'grey.400'
                      },
                      '& .MuiStepIcon-active': {
                        color: 'primary.main'
                      },
                      '& .MuiStepIcon-completed': {
                        color: 'success.main'
                      }
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Step Content */}
          <Box sx={{ mt: 2 }}>
            {renderStepContent(activeStep)}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
          >
            Back
          </Button>
          
          <Box sx={{ flex: 1 }} />
          
          <Button
            onClick={handleClose}
            variant="text"
            color="inherit"
          >
            Cancel
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              startIcon={<CheckCircle />}
              className="!text-white"
            >
              {mode === 'edit' ? 'Update Record' : 'Submit Correction'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
              className="!text-white"
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ManualCorrectionModal;