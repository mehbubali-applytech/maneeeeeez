"use client";

import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  AvatarGroup,
  Tooltip,
  Alert
} from "@mui/material";
import {
  CalendarMonth,
  Today,
  NavigateBefore,
  NavigateNext,
  FilterList,
  People,
  Event
} from "@mui/icons-material";
import { ILeaveRequest } from "./LeaveRequestsPanel";

interface LeaveCalendarViewProps {
  requests: ILeaveRequest[];
}

const LeaveCalendarView: React.FC<LeaveCalendarViewProps> = ({ requests }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // Generate calendar days
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const month = currentMonth.getMonth();
  const year = currentMonth.getFullYear();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blankDays = Array.from({ length: firstDay }, (_, i) => null);

  const getRequestsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return requests.filter(req => {
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      const current = new Date(dateStr);
      return current >= start && current <= end && req.status !== 'cancelled';
    });
  };

  const getLeaveTypeColor = (leaveType: string) => {
    switch (leaveType) {
      case 'Casual Leave': return 'info';
      case 'Sick Leave': return 'warning';
      case 'Earned Leave': return 'success';
      case 'Maternity Leave': return 'primary';
      case 'Paternity Leave': return 'secondary';
      default: return 'default';
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <Box>
      {/* Calendar Controls */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={handlePreviousMonth}>
                <NavigateBefore />
              </IconButton>
              
              <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
                {monthNames[month]} {year}
              </Typography>
              
              <IconButton onClick={handleNextMonth}>
                <NavigateNext />
              </IconButton>
              
              <IconButton onClick={handleToday}>
                <Today />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>View</InputLabel>
                <Select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as 'month' | 'week')}
                  label="View"
                >
                  <MenuItem value="month">Month View</MenuItem>
                  <MenuItem value="week">Week View</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  label="Department"
                >
                  <MenuItem value="all">All Departments</MenuItem>
                  <MenuItem value="Engineering">Engineering</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Sales">Sales</MenuItem>
                  <MenuItem value="HR">HR</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Calendar Header */}
      <Grid container spacing={1} sx={{ mb: 1 }}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Grid item xs key={day}>
            <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'grey.100' }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {day}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Calendar Grid */}
      <Grid container spacing={1}>
        {/* Blank days for start of month */}
        {blankDays.map((_, index) => (
          <Grid item xs key={`blank-${index}`}>
            <Paper sx={{ height: 120, bgcolor: 'grey.50' }} />
          </Grid>
        ))}
        
        {/* Calendar days */}
        {days.map((day) => {
          const dayRequests = getRequestsForDay(day);
          const isToday = 
            day === new Date().getDate() && 
            month === new Date().getMonth() && 
            year === new Date().getFullYear();
          
          return (
            <Grid item xs key={day}>
              <Paper 
                sx={{ 
                  height: 120, 
                  p: 1,
                  border: isToday ? 2 : 1,
                  borderColor: isToday ? 'primary.main' : 'divider',
                  bgcolor: isToday ? 'primary.50' : 'white',
                  overflow: 'auto'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography 
                    variant="body2" 
                    fontWeight={isToday ? 600 : 400}
                    color={isToday ? 'primary.main' : 'text.primary'}
                  >
                    {day}
                  </Typography>
                  
                  {dayRequests.length > 0 && (
                    <Chip 
                      label={dayRequests.length} 
                      size="small" 
                      color="primary"
                    />
                  )}
                </Box>
                
                {/* Leave requests for this day */}
                <Box sx={{ maxHeight: 80, overflow: 'auto' }}>
                  {dayRequests.slice(0, 3).map((req, idx) => (
                    <Tooltip 
                      key={idx} 
                      title={`${req.employeeName} - ${req.leaveType}`}
                      placement="right"
                    >
                      <Chip
                        label={`${req.employeeName.split(' ')[0]} - ${req.leaveTypeCode}`}
                        size="small"
                        color={getLeaveTypeColor(req.leaveType) as any}
                        sx={{ mb: 0.5, width: '100%', justifyContent: 'flex-start' }}
                        variant="outlined"
                      />
                    </Tooltip>
                  ))}
                  
                  {dayRequests.length > 3 && (
                    <AvatarGroup max={3} sx={{ justifyContent: 'flex-start' }}>
                      {dayRequests.slice(3).map((req, idx) => (
                        <Tooltip key={idx} title={req.employeeName}>
                          <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                            {req.employeeName.charAt(0)}
                          </Avatar>
                        </Tooltip>
                      ))}
                    </AvatarGroup>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Legend */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          <Event fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
          Leave Type Legend
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="Casual Leave" size="small" color="info" variant="outlined" />
          <Chip label="Sick Leave" size="small" color="warning" variant="outlined" />
          <Chip label="Earned Leave" size="small" color="success" variant="outlined" />
          <Chip label="Maternity Leave" size="small" color="primary" variant="outlined" />
          <Chip label="Paternity Leave" size="small" color="secondary" variant="outlined" />
        </Box>
      </Paper>

      {/* Statistics */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="warning.main">
              {requests.filter(r => r.status === 'pending').length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Pending This Month
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="success.main">
              {requests.filter(r => r.status === 'approved').length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Approved This Month
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">
              {Array.from(new Set(requests.map(r => r.department))).length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Departments with Leaves
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6" color="info.main">
              {Array.from(new Set(requests.map(r => r.employeeName))).length}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Employees on Leave
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeaveCalendarView;