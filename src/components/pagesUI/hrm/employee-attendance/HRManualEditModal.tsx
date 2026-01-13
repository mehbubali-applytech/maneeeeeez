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
  Alert,
  Chip,
  IconButton,
  Paper,
  Divider
} from "@mui/material";
import {
  Close,
  AccessTime,
  CalendarMonth,
  Person,
  Save,
  History
} from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { IAttendanceRecord } from "../../owner/attendance/AttendanceTypes";

interface HRManualEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: HRManualEditFormData) => void;
  record: IAttendanceRecord | null;
  currentUser: string;
}

interface HRManualEditFormData {
  attendanceId: string;
  date: string;
  employeeName: string;
  checkInTime: string;
  checkOutTime: string;
  overrideReason: string;
  changedBy: string;
  changedAt: string;
}

const HRManualEditModal: React.FC<HRManualEditModalProps> = ({
  open,
  onClose,
  onSubmit,
  record,
  currentUser = "HR Manager"
}) => {
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<Date | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (record) {
      // Parse check-in time
      if (record.checkInTime) {
        const [hours, minutes] = record.checkInTime.split(':').map(Number);
        const checkInDate = new Date();
        checkInDate.setHours(hours, minutes, 0, 0);
        setCheckInTime(checkInDate);
      } else {
        // Default to 9 AM if no check-in
        const defaultTime = new Date();
        defaultTime.setHours(9, 0, 0, 0);
        setCheckInTime(defaultTime);
      }

      // Parse check-out time
      if (record.checkOutTime) {
        const [hours, minutes] = record.checkOutTime.split(':').map(Number);
        const checkOutDate = new Date();
        checkOutDate.setHours(hours, minutes, 0, 0);
        setCheckOutTime(checkOutDate);
      } else {
        // Default to 6 PM if no check-out
        const defaultTime = new Date();
        defaultTime.setHours(18, 0, 0, 0);
        setCheckOutTime(defaultTime);
      }

      setOverrideReason(record.manualOverrideReason || "");
    } else {
      // Reset to default times
      const defaultInTime = new Date();
      defaultInTime.setHours(9, 0, 0, 0);
      setCheckInTime(defaultInTime);
      
      const defaultOutTime = new Date();
      defaultOutTime.setHours(18, 0, 0, 0);
      setCheckOutTime(defaultOutTime);
      
      setOverrideReason("");
    }
    setErrors({});
  }, [record]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!checkInTime) {
      newErrors.checkInTime = 'Check-in time is required';
    }

    if (!checkOutTime) {
      newErrors.checkOutTime = 'Check-out time is required';
    }

    if (checkInTime && checkOutTime && checkOutTime <= checkInTime) {
      newErrors.checkOutTime = 'Check-out time must be after check-in time';
    }

    if (!overrideReason.trim()) {
      newErrors.overrideReason = 'Override reason is required';
    } else if (overrideReason.length < 10) {
      newErrors.overrideReason = 'Please provide a detailed reason (min. 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatTime = (date: Date | null): string => {
    if (!date) return '00:00';
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  const calculateHours = (): number => {
    if (!checkInTime || !checkOutTime) return 0;
    const diffMs = checkOutTime.getTime() - checkInTime.getTime();
    return diffMs / (1000 * 60 * 60);
  };

  const handleSubmit = () => {
    if (!record || !validateForm()) return;

    const formData: HRManualEditFormData = {
      attendanceId: record.id,
      date: record.date,
      employeeName: record.employeeName,
      checkInTime: formatTime(checkInTime),
      checkOutTime: formatTime(checkOutTime),
      overrideReason,
      changedBy: currentUser,
      changedAt: new Date().toISOString()
    };

    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setCheckInTime(null);
    setCheckOutTime(null);
    setOverrideReason("");
    setErrors({});
    onClose();
  };

  if (!record) return null;

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
                Manual Attendance Correction
              </Typography>
            </Box>
            <IconButton onClick={handleClose} size="small">
              <Close />
            </IconButton>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Override attendance record for {record.employeeName}
          </Typography>
        </DialogTitle>
        
        <DialogContent>
          {/* Original Record Info */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <History fontSize="small" /> Original Record
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">Check-In</Typography>
                <Typography variant="body2">
                  {record.checkInTime || 'Not recorded'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">Check-Out</Typography>
                <Typography variant="body2">
                  {record.checkOutTime || 'Not recorded'}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Chip 
                  label={record.attendanceStatus} 
                  size="small" 
                  color={
                    record.attendanceStatus === 'Present' ? 'success' :
                    record.attendanceStatus === 'Late' ? 'warning' :
                    record.attendanceStatus === 'Absent' ? 'error' : 'default'
                  }
                />
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">Hours</Typography>
                <Typography variant="body2">
                  {record.totalHours ? `${record.totalHours.toFixed(2)}h` : '0h'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={3}>
            {/* Read-only fields */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Employee Name"
                value={record.employeeName}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <Person sx={{ mr: 1, color: 'action.active' }} />
                  ),
                }}
                variant="outlined"
                size="small"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                value={new Date(record.date).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                InputProps={{
                  readOnly: true,
                  startAdornment: (
                    <CalendarMonth sx={{ mr: 1, color: 'action.active' }} />
                  ),
                }}
                variant="outlined"
                size="small"
              />
            </Grid>

            {/* Editable time fields */}
            <Grid item xs={12} md={6}>
              <TimePicker
                label="Check-In Time *"
                value={checkInTime}
                onChange={setCheckInTime}
                ampm={false}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: !!errors.checkInTime,
                    helperText: errors.checkInTime,
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TimePicker
                label="Check-Out Time *"
                value={checkOutTime}
                onChange={setCheckOutTime}
                ampm={false}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: 'small',
                    error: !!errors.checkOutTime,
                    helperText: errors.checkOutTime,
                  }
                }}
              />
            </Grid>

            {/* Hours calculation */}
            <Grid item xs={12}>
              <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'primary.50' }}>
                <Grid container alignItems="center">
                  <Grid item xs={8}>
                    <Typography variant="caption" color="text.secondary">
                      Calculated Working Hours
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      {calculateHours().toFixed(2)} hours
                    </Typography>
                  </Grid>
                  <Grid item xs={4} sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">
                      Check-In: {formatTime(checkInTime)}
                    </Typography>
                    <br />
                    <Typography variant="caption" color="text.secondary">
                      Check-Out: {formatTime(checkOutTime)}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Override reason */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Override Reason *"
                multiline
                rows={4}
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                error={!!errors.overrideReason}
                helperText={errors.overrideReason || "Explain why this manual change is necessary"}
                placeholder="Enter detailed reason for overriding the attendance record..."
                variant="outlined"
                size="small"
              />
            </Grid>

            {/* Audit info */}
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" color="text.secondary">
                This change will be recorded in the audit log as:
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Chip 
                  label={`Changed by: ${currentUser}`} 
                  size="small" 
                  variant="outlined"
                />
                <Chip 
                  label={`Date: ${new Date().toLocaleDateString()}`} 
                  size="small" 
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 3 }}>
            <Typography variant="caption">
              <strong>Important:</strong> Manual overrides are recorded in the audit trail and cannot be undone without supervisor approval. Please ensure the reason is valid and properly documented.
            </Typography>
          </Alert>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            onClick={handleClose}
            variant="text"
            color="inherit"
          >
            Cancel
          </Button>
          
          <Box sx={{ flex: 1 }} />
          
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            startIcon={<Save />}
            className="!text-white"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default HRManualEditModal;