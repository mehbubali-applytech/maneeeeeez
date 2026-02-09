// CreateLeaveModal.tsx
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
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  CircularProgress
} from "@mui/material";
import {
  Close,
  Person,
  CalendarMonth,
  AccessTime,
  Description,
  EventBusy
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { createLeaveRequest } from "./attendanceApi";

interface CreateLeaveModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveFormData) => void;
  employees: Array<{
    id: number;
    name: string;
    code: string;
    department: string;
  }>;
  leaveTypes: string[];
}

interface LeaveFormData {
  employee_id: number;
  start_date: Date;
  end_date: Date;
  leave_type: string;
  reason: string;
}

const CreateLeaveModal: React.FC<CreateLeaveModalProps> = ({
  open,
  onClose,
  onSubmit,
  employees,
  leaveTypes
}) => {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [leaveType, setLeaveType] = useState<string>("");
  const [reason, setReason] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};

    if (!selectedEmployee) {
      newErrors.employee = 'Please select an employee';
    }
    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (startDate && endDate && endDate < startDate) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    if (!leaveType) {
      newErrors.leaveType = 'Leave type is required';
    }
    if (!reason.trim()) {
      newErrors.reason = 'Reason is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && selectedEmployee && startDate && endDate) {
      setLoading(true);
      try {
        const formData: LeaveFormData = {
          employee_id: selectedEmployee.id,
          start_date: startDate,
          end_date: endDate,
          leave_type: leaveType,
          reason
        };

        await onSubmit(formData);
        handleClose();
      } catch (error) {
        console.error('Error creating leave:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClose = () => {
    setSelectedEmployee(null);
    setStartDate(new Date());
    setEndDate(new Date());
    setLeaveType("");
    setReason("");
    setErrors({});
    onClose();
  };

  const calculateDuration = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog 
        open={open} 
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventBusy color="primary" />
            <Typography variant="h6">Create Leave Request</Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => `${option.name} (${option.code}) - ${option.department}`}
                value={selectedEmployee}
                onChange={(_, newValue) => setSelectedEmployee(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Employee *"
                    error={!!errors.employee}
                    helperText={errors.employee}
                    placeholder="Select employee"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Typography variant="body2">{option.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.code} • {option.department}
                      </Typography>
                    </Box>
                  </li>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Start Date *"
                value={startDate}
                onChange={setStartDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.startDate,
                    helperText: errors.startDate
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker
                label="End Date *"
                value={endDate}
                onChange={setEndDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.endDate,
                    helperText: errors.endDate
                  }
                }}
              />
            </Grid>
            
            {startDate && endDate && (
              <Grid item xs={12}>
                <Alert severity="info" icon={false}>
                  <Typography variant="body2">
                    Duration: <strong>{calculateDuration()} days</strong>
                  </Typography>
                </Alert>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.leaveType}>
                <InputLabel>Leave Type *</InputLabel>
                <Select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  label="Leave Type *"
                >
                  {leaveTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.leaveType && (
                  <Typography variant="caption" color="error">
                    {errors.leaveType}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Reason for Leave *"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                error={!!errors.reason}
                helperText={errors.reason}
                placeholder="Please provide a detailed reason for the leave..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            className="!text-white"
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : 'Submit Leave Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CreateLeaveModal;