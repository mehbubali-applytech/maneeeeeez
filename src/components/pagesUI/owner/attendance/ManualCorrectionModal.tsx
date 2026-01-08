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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  Divider
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
  Error
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
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
  checkInTime: string;
  checkOutTime: string;
  reason: string;
  supportingDocuments: File[];
  correctionType: 'checkin' | 'checkout' | 'both';
  isForFuture?: boolean;
}

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
  const [employeeId, setEmployeeId] = useState(record?.employeeId || "");
  const [checkInTime, setCheckInTime] = useState(record?.checkInTime || "09:00");
  const [checkOutTime, setCheckOutTime] = useState(record?.checkOutTime || "18:00");
  const [reason, setReason] = useState("");
  const [supportingDocuments, setSupportingDocuments] = useState<File[]>([]);
  const [isForFuture, setIsForFuture] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = ['Select Type', 'Enter Details', 'Provide Reason', 'Review'];

  // Mock employees for dropdown
  const employees = [
    { id: 'EMP001', name: 'Rajesh Kumar', department: 'Engineering' },
    { id: 'EMP002', name: 'Priya Sharma', department: 'Marketing' },
    { id: 'EMP003', name: 'Amit Patel', department: 'Sales' },
    { id: 'EMP004', name: 'Sneha Reddy', department: 'HR' }
  ];

  useEffect(() => {
    if (record) {
      setEmployeeId(record.employeeId);
      setDate(new Date(record.date));
      setCheckInTime(record.checkInTime || "09:00");
      setCheckOutTime(record.checkOutTime || "18:00");
      setReason(record.correctionRequest?.reason || "");
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
        if (!employeeId) {
          newErrors.employeeId = 'Employee is required';
        }
        if (correctionType !== 'checkout' && !checkInTime) {
          newErrors.checkInTime = 'Check-in time is required';
        }
        if (correctionType !== 'checkin' && !checkOutTime) {
          newErrors.checkOutTime = 'Check-out time is required';
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
    if (!date) {
      setErrors({ date: 'Date is required' });
      return;
    }

    const formData: CorrectionFormData = {
      date,
      employeeId,
      checkInTime: correctionType !== 'checkout' ? checkInTime : '',
      checkOutTime: correctionType !== 'checkin' ? checkOutTime : '',
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
    setEmployeeId(record?.employeeId || "");
    setCheckInTime(record?.checkInTime || "09:00");
    setCheckOutTime(record?.checkOutTime || "18:00");
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
      setSupportingDocuments(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSupportingDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const getSelectedEmployee = () => {
    return employees.find(emp => emp.id === employeeId);
  };

  const formatTime = (time: string) => {
    if (!time) return 'Not set';
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
              <Paper variant="outlined" sx={{ p: 2, mb: 2, cursor: 'pointer' }}
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
              
              <Paper variant="outlined" sx={{ p: 2, mb: 2, cursor: 'pointer' }}
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
              
              <Paper variant="outlined" sx={{ p: 2, cursor: 'pointer' }}
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
                <FormControl fullWidth error={!!errors.employeeId}>
                  <InputLabel>Employee *</InputLabel>
                  <Select
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    label="Employee *"
                  >
                    {employees.map(emp => (
                      <MenuItem key={emp.id} value={emp.id}>
                        {emp.name} ({emp.department})
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.employeeId && (
                    <Typography variant="caption" color="error">
                      {errors.employeeId}
                    </Typography>
                  )}
                </FormControl>
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
                    <Typography variant="caption">
                      This is for a future date
                    </Typography>
                  }
                />
              </Grid>
              
              {correctionType !== 'checkout' && (
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Check-In Time *"
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    fullWidth
                    error={!!errors.checkInTime}
                    helperText={errors.checkInTime}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              )}
              
              {correctionType !== 'checkin' && (
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Check-Out Time *"
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    fullWidth
                    error={!!errors.checkOutTime}
                    helperText={errors.checkOutTime}
                    InputLabelProps={{ shrink: true }}
                  />
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
            
            <TextField
              label="Reason for Correction *"
              multiline
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              fullWidth
              error={!!errors.reason}
              helperText={errors.reason || "Explain why this correction is needed"}
              placeholder="e.g., Forgot to check-in, System error, Emergency situation..."
            />
            
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Supporting Documents (Optional)
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                Upload screenshots, emails, or other documents to support your request
              </Typography>
              
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              
              <Button
                variant="outlined"
                startIcon={<Upload />}
                onClick={() => document.getElementById('file-upload')?.click()}
                sx={{ mb: 2 }}
              >
                Upload Files
              </Button>
              
              {supportingDocuments.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Uploaded files:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {supportingDocuments.map((file, index) => (
                      <Chip
                        key={index}
                        label={file.name}
                        size="small"
                        onDelete={() => removeFile(index)}
                        icon={<AttachFile />}
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
            
            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="caption">
                Note: All correction requests are reviewed by HR/Admin. Please provide accurate information.
              </Typography>
            </Alert>
          </Box>
        );

      case 3:
        const employee = getSelectedEmployee();
        const totalHours = checkInTime && checkOutTime ? 
          (new Date(`2000-01-01T${checkOutTime}`).getTime() - new Date(`2000-01-01T${checkInTime}`).getTime()) / (1000 * 60 * 60) : 0;
        
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
                    {employee?.name || 'Not selected'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Department</Typography>
                  <Typography variant="body2">
                    {employee?.department || '—'}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Date</Typography>
                  <Typography variant="body2">
                    {date?.toLocaleDateString('en-IN', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="caption" color="text.secondary">Correction Type</Typography>
                  <Chip 
                    label={correctionType === 'both' ? 'Both Times' : correctionType === 'checkin' ? 'Check-In Only' : 'Check-Out Only'} 
                    size="small" 
                    color="primary"
                  />
                </Grid>
                
                {correctionType !== 'checkout' && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Check-In Time</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatTime(checkInTime)}
                    </Typography>
                  </Grid>
                )}
                
                {correctionType !== 'checkin' && (
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">Check-Out Time</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {formatTime(checkOutTime)}
                    </Typography>
                  </Grid>
                )}
                
                {checkInTime && checkOutTime && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Total Working Hours</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {totalHours.toFixed(2)} hours
                    </Typography>
                  </Grid>
                )}
                
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">Reason</Typography>
                  <Paper variant="outlined" sx={{ p: 1.5, mt: 0.5, bgcolor: 'grey.50' }}>
                    <Typography variant="body2">
                      {reason}
                    </Typography>
                  </Paper>
                </Grid>
                
                {supportingDocuments.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">Supporting Documents</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
                      {supportingDocuments.map((file, index) => (
                        <Chip
                          key={index}
                          label={file.name}
                          size="small"
                          icon={<AttachFile />}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Paper>
            
            <Alert severity={isForFuture ? "warning" : "info"}>
              <Typography variant="caption">
                {isForFuture 
                  ? "⚠️ This is a future date correction. It will be applied when the date arrives."
                  : "This correction request will be submitted for approval. You'll be notified once it's reviewed."
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
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {mode === 'edit' ? 'Edit Attendance Record' : 'Manual Attendance Correction'}
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {/* Step Content */}
          <Box sx={{ mt: 2 }}>
            {renderStepContent(activeStep)}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              startIcon={<CheckCircle />}
            >
              {mode === 'edit' ? 'Update Record' : 'Submit Correction'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              variant="contained"
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