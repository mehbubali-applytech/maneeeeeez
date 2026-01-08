"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Chip,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete
} from "@mui/material";
import {
  CalendarMonth,
  ChevronLeft,
  ChevronRight,
  Today,
  FilterList,
  Download,
  Visibility,
  Person,
  Event
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ILeaveRequest, LEAVE_TYPES, getLeaveTypeColor } from "./LeaveTypes";

interface LeaveCalendarProps {
  leaveRequests?: ILeaveRequest[];
  onViewDetails?: (request: ILeaveRequest) => void;
  onFilterChange?: (filters: any) => void;
}

const LeaveCalendar: React.FC<LeaveCalendarProps> = ({
  leaveRequests = [],
  onViewDetails
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterLeaveType, setFilterLeaveType] = useState("All");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<ILeaveRequest | null>(null);

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  }, [currentDate]);

  // Filter leave requests
  const filteredLeaves = useMemo(() => {
    let filtered = leaveRequests.filter(leave => leave.status === 'Approved');
    
    if (filterDepartment !== "All") {
      filtered = filtered.filter(leave => leave.department === filterDepartment);
    }
    
    if (filterLeaveType !== "All") {
      filtered = filtered.filter(leave => leave.leaveType === filterLeaveType);
    }
    
    return filtered;
  }, [leaveRequests, filterDepartment, filterLeaveType]);

  // Get leaves for a specific date
  const getLeavesForDate = (date: Date) => {
    if (!date) return [];
    
    const dateStr = date.toISOString().split('T')[0];
    return filteredLeaves.filter(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const current = new Date(dateStr);
      return current >= start && current <= end;
    });
  };

  const departmentOptions = useMemo(() => [
    { label: "All Departments", value: "All" },
    { label: "Engineering", value: "Engineering" },
    { label: "Marketing", value: "Marketing" },
    { label: "Sales", value: "Sales" },
    { label: "HR", value: "HR" }
  ], []);

  const leaveTypeOptions = useMemo(() => [
    { label: "All Types", value: "All" },
    { label: "Annual Leave", value: "Annual" },
    { label: "Sick Leave", value: "Sick" },
    { label: "Casual Leave", value: "Casual" },
    { label: "Maternity Leave", value: "Maternity" }
  ], []);

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const leaves = getLeavesForDate(date);
    if (leaves.length > 0) {
      setSelectedLeave(leaves[0]);
      setDetailDialogOpen(true);
    }
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getLeaveColor = (leaveType: string) => {
    const color = getLeaveTypeColor(leaveType as any);
    switch(color) {
      case 'success': return '#4caf50';
      case 'info': return '#2196f3';
      case 'primary': return '#3f51b5';
      case 'secondary': return '#9c27b0';
      case 'warning': return '#ff9800';
      default: return '#757575';
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonth /> Leave Calendar
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<Today />}
                onClick={handleToday}
                size="small"
              >
                Today
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => console.log("Export calendar")}
                size="small"
              >
                Export
              </Button>
            </Box>
          </Box>
          
          {/* Month Navigation */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={handlePreviousMonth} size="small">
                  <ChevronLeft />
                </IconButton>
                
                <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
                  {formatMonthYear(currentDate)}
                </Typography>
                
                <IconButton onClick={handleNextMonth} size="small">
                  <ChevronRight />
                </IconButton>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {filteredLeaves.length} approved leaves
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <Autocomplete
                fullWidth
                size="small"
                options={departmentOptions}
                value={departmentOptions.find(opt => opt.value === filterDepartment) || null}
                onChange={(event, newValue) => {
                  setFilterDepartment(newValue?.value || "All");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Department"
                    placeholder="Select department"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Autocomplete
                fullWidth
                size="small"
                options={leaveTypeOptions}
                value={leaveTypeOptions.find(opt => opt.value === filterLeaveType) || null}
                onChange={(event, newValue) => {
                  setFilterLeaveType(newValue?.value || "All");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Leave Type"
                    placeholder="Select type"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setFilterDepartment("All");
                  setFilterLeaveType("All");
                }}
                fullWidth
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Calendar Grid */}
        <Paper sx={{ p: 2 }}>
          {/* Day Headers */}
          <Grid container spacing={1} sx={{ mb: 1 }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Grid item xs key={day}>
                <Typography
                  variant="subtitle2"
                  align="center"
                  color={day === 'Sun' || day === 'Sat' ? 'error.main' : 'text.primary'}
                  sx={{ fontWeight: 600 }}
                >
                  {day}
                </Typography>
              </Grid>
            ))}
          </Grid>
          
          {/* Calendar Days */}
          <Grid container spacing={1}>
            {calendarDays.map((date, index) => {
              const isToday = date && date.toDateString() === new Date().toDateString();
              const isWeekend = date && (date.getDay() === 0 || date.getDay() === 6);
              const leaves = date ? getLeavesForDate(date) : [];
              
              return (
                <Grid item xs key={index} sx={{ minHeight: 120 }}>
                  <Card 
                    variant="outlined" 
                    sx={{ 
                      height: '100%',
                      bgcolor: isToday ? 'primary.50' : isWeekend ? 'grey.50' : 'background.paper',
                      borderColor: isToday ? 'primary.main' : 'divider',
                      cursor: leaves.length > 0 ? 'pointer' : 'default',
                      '&:hover': leaves.length > 0 ? { 
                        boxShadow: 2,
                        borderColor: 'primary.light'
                      } : {}
                    }}
                    onClick={() => date && leaves.length > 0 && handleDateClick(date)}
                  >
                    <CardContent sx={{ p: 1, height: '100%', position: 'relative' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isToday ? 600 : 'normal',
                            color: isToday ? 'primary.main' : isWeekend ? 'error.main' : 'text.primary'
                          }}
                        >
                          {date ? date.getDate() : ''}
                        </Typography>
                        
                        {leaves.length > 0 && (
                          <Chip
                            label={leaves.length}
                            size="small"
                            color="primary"
                          />
                        )}
                      </Box>
                      
                      {/* Leaves for this day */}
                      <Box sx={{ mt: 1 }}>
                        {leaves.slice(0, 2).map((leave, idx) => (
                          <Tooltip 
                            key={idx} 
                            title={`${leave.employeeName} - ${leave.leaveType}`}
                          >
                            <Box
                              sx={{
                                bgcolor: getLeaveColor(leave.leaveType) + '20',
                                borderLeft: `3px solid ${getLeaveColor(leave.leaveType)}`,
                                p: 0.5,
                                mb: 0.5,
                                borderRadius: '4px',
                                overflow: 'hidden'
                              }}
                            >
                              <Typography variant="caption" noWrap>
                                {leave.employeeName.split(' ')[0]}
                              </Typography>
                            </Box>
                          </Tooltip>
                        ))}
                        
                        {leaves.length > 2 && (
                          <Typography variant="caption" color="text.secondary">
                            +{leaves.length - 2} more
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Paper>

        {/* Legend */}
        <Paper sx={{ p: 2, mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>Leave Type Legend</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {(Object.entries(LEAVE_TYPES) as [string, { label: string }][]).map(([key, value]) => (
              <Box key={key} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    bgcolor: getLeaveColor(value.label.split(' ')[0]),
                    borderRadius: '2px'
                  }}
                />
                <Typography variant="caption">
                  {value.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Leave Details Dialog */}
        <Dialog 
          open={detailDialogOpen} 
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          {selectedLeave && selectedDate && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Event />
                  Leave Details - {formatDate(selectedDate)}
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>Employees on Leave:</Typography>
                  {getLeavesForDate(selectedDate).map((leave, index) => (
                    <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person fontSize="small" />
                          <Typography variant="body2" fontWeight={600}>
                            {leave.employeeName}
                          </Typography>
                        </Box>
                        <Chip 
                          label={leave.leaveType} 
                          size="small" 
                          color={getLeaveTypeColor(leave.leaveType) as any}
                          variant="outlined"
                        />
                      </Box>
                      
                      <Typography variant="caption" color="text.secondary" display="block">
                        Department: {leave.department}
                      </Typography>
                      
                      <Typography variant="caption" color="text.secondary" display="block">
                        Dates: {formatDate(new Date(leave.startDate))} - {formatDate(new Date(leave.endDate))}
                      </Typography>
                      
                      <Typography variant="caption" color="text.secondary" display="block">
                        Total Days: {leave.totalDays}
                      </Typography>
                      
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => {
                          onViewDetails?.(leave);
                          setDetailDialogOpen(false);
                        }}
                        sx={{ mt: 1 }}
                      >
                        View Full Details
                      </Button>
                    </Card>
                  ))}
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Stats Summary */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">
                {filteredLeaves.length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Approved Leaves
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">
                {new Set(filteredLeaves.map(l => l.employeeId)).size}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Unique Employees
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">
                {filteredLeaves.filter(l => l.leaveType === 'Annual').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Annual Leaves
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">
                {filteredLeaves.filter(l => l.leaveType === 'Sick').length}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Sick Leaves
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </LocalizationProvider>
  );
};

export default LeaveCalendar;