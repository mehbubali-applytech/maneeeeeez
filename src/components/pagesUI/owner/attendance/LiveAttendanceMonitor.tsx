"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Button,
  Grid,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tooltip,
  Alert,
  CircularProgress,
  Badge,
  Autocomplete
} from "@mui/material";
import {
  Refresh,
  Search,
  AccessTime,
  LocationOn,
  CheckCircle,
  Error,
  Schedule,
  FilterList,
  Edit,
  Visibility,
  PlayArrow,
  Stop,
  Timer
} from "@mui/icons-material";
import { IAttendanceRecord, DEPARTMENTS, SHIFTS } from "./AttendanceTypes";
import { DownloadButtonGroup, TableData } from "@/app/helpers/downloader";

interface LiveAttendanceMonitorProps {
  attendanceData?: IAttendanceRecord[];
  onRefresh?: () => void;
  onEditAttendance?: (record: IAttendanceRecord) => void;
  onViewDetails?: (record: IAttendanceRecord) => void;
}

const LiveAttendanceMonitor: React.FC<LiveAttendanceMonitorProps> = ({
  attendanceData = [],
  onRefresh,
  onEditAttendance,
  onViewDetails
}) => {
  const [filterDepartment, setFilterDepartment] = useState<string>("All");
  const [filterShift, setFilterShift] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Mock data for today
  const mockTodayAttendance: IAttendanceRecord[] = useMemo(() => [
    {
      id: "1",
      employeeId: "EMP001",
      employeeName: "Rajesh Kumar",
      department: "Engineering",
      role: "Software Engineer",
      shiftId: 1,
      shiftName: "Morning Shift",
      shiftStartTime: "09:00",
      shiftEndTime: "18:00",
      date: new Date().toISOString().split('T')[0],
      checkInTime: "08:55",
      checkOutTime: "18:10",
      checkInLocation: "Bangalore Office",
      totalHours: 9.25,
      attendanceStatus: "Present",
      isManualEntry: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      employeeId: "EMP002",
      employeeName: "Priya Sharma",
      department: "Marketing",
      role: "Marketing Manager",
      shiftId: 2,
      shiftName: "Evening Shift",
      shiftStartTime: "14:00",
      shiftEndTime: "22:00",
      date: new Date().toISOString().split('T')[0],
      checkInTime: "14:25",
      checkOutTime: "22:05",
      checkInLocation: "Delhi Office",
      totalHours: 7.67,
      attendanceStatus: "Late",
      lateMinutes: 25,
      isManualEntry: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "3",
      employeeId: "EMP003",
      employeeName: "Amit Patel",
      department: "Sales",
      role: "Sales Executive",
      shiftId: 1,
      shiftName: "Morning Shift",
      shiftStartTime: "09:00",
      shiftEndTime: "18:00",
      date: new Date().toISOString().split('T')[0],
      checkInTime: "09:15",
      checkOutTime: undefined,
      checkInLocation: "Mumbai Office",
      totalHours: 0,
      attendanceStatus: "Present",
      isManualEntry: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "4",
      employeeId: "EMP004",
      employeeName: "Sneha Reddy",
      department: "HR",
      role: "HR Manager",
      shiftId: 1,
      shiftName: "Morning Shift",
      shiftStartTime: "09:00",
      shiftEndTime: "18:00",
      date: new Date().toISOString().split('T')[0],
      checkInTime: undefined,
      checkOutTime: undefined,
      attendanceStatus: "Absent",
      isManualEntry: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ], []);

  const data = attendanceData.length > 0 ? attendanceData : mockTodayAttendance;

  // Prepare department options for Autocomplete
  const departmentOptions = useMemo(() => {
    const departments = ["All", ...DEPARTMENTS];
    return departments.map(dept => ({ label: dept, value: dept }));
  }, []);

  // Prepare shift options for Autocomplete
  const shiftOptions = useMemo(() => {
    const shifts = ["All", ...SHIFTS.map(shift => shift.name)];
    return shifts.map(shift => ({ label: shift, value: shift }));
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (onRefresh) {
      onRefresh();
    }
    setTimeout(() => {
      setIsRefreshing(false);
      setLastUpdated(new Date());
    }, 1000);
  }, [onRefresh]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, handleRefresh]);

  const filteredData = useMemo(() => {
    return data.filter(record => {
      // Filter by department
      if (filterDepartment !== "All" && record.department !== filterDepartment) {
        return false;
      }
      
      // Filter by shift
      if (filterShift !== "All" && record.shiftName !== filterShift) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery && !record.employeeName.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [data, filterDepartment, filterShift, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Present':
        return <Chip icon={<CheckCircle />} label="Present" color="success" size="small" />;
      case 'Late':
        return <Chip icon={<Schedule />} label="Late" color="warning" size="small" />;
      case 'Absent':
        return <Chip icon={<Error />} label="Absent" color="error" size="small" />;
      case 'Half-Day':
        return <Chip label="Half-Day" color="info" size="small" />;
      case 'On Leave':
        return <Chip label="On Leave" color="default" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getAttendanceSummary = () => {
    const total = filteredData.length;
    const present = filteredData.filter(r => r.attendanceStatus === 'Present').length;
    const absent = filteredData.filter(r => r.attendanceStatus === 'Absent').length;
    const late = filteredData.filter(r => r.attendanceStatus === 'Late').length;
    const checkedIn = filteredData.filter(r => r.checkInTime).length;
    const checkedOut = filteredData.filter(r => r.checkOutTime).length;
    
    return { total, present, absent, late, checkedIn, checkedOut };
  };

  const summary = getAttendanceSummary();

  // Prepare table data for export
  const exportData = useMemo((): TableData => {
    const headers = [
      "Employee Name",
      "Employee ID",
      "Department",
      "Role",
      "Shift",
      "Shift Timing",
      "Check-In Time",
      "Check-Out Time",
      "Total Hours",
      "Attendance Status",
      "Location",
      "Late Minutes"
    ];
    
    const rows = filteredData.map(record => {
      return [
        record.employeeName,
        record.employeeId,
        record.department,
        record.role,
        record.shiftName,
        `${record.shiftStartTime} - ${record.shiftEndTime}`,
        record.checkInTime || "Not checked in",
        record.checkOutTime || "Not checked out",
        record.totalHours ? `${record.totalHours.toFixed(2)}h` : "0h",
        record.attendanceStatus,
        record.checkInLocation || "-",
        record.lateMinutes ? `${record.lateMinutes}m` : "-"
      ];
    });
    
    return {
      headers,
      rows,
      title: `Attendance Report - ${new Date().toLocaleDateString()}`
    };
  }, [filteredData]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTime /> Live Attendance Monitor
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Last updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
            
            <Tooltip title={autoRefresh ? "Auto-refresh enabled" : "Auto-refresh disabled"}>
              <IconButton
                size="small"
                onClick={() => setAutoRefresh(!autoRefresh)}
                color={autoRefresh ? "primary" : "default"}
              >
                <Timer />
              </IconButton>
            </Tooltip>

            
            <Button
              variant="outlined"
              startIcon={isRefreshing ? <CircularProgress size={16} /> : <Refresh />}
              onClick={handleRefresh}
              disabled={isRefreshing}
              size="small"
            >
              Refresh
            </Button>
          </Box>
        </Box>
        
        {/* Summary Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{summary.total}</Typography>
              <Typography variant="caption" color="text.secondary">Total</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center', borderColor: 'success.main', border: 1 }}>
              <Typography variant="h6" color="success.main">{summary.present}</Typography>
              <Typography variant="caption" color="text.secondary">Present</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center', borderColor: 'error.main', border: 1 }}>
              <Typography variant="h6" color="error.main">{summary.absent}</Typography>
              <Typography variant="caption" color="text.secondary">Absent</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center', borderColor: 'warning.main', border: 1 }}>
              <Typography variant="h6" color="warning.main">{summary.late}</Typography>
              <Typography variant="caption" color="text.secondary">Late</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{summary.checkedIn}</Typography>
              <Typography variant="caption" color="text.secondary">Checked In</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6">{summary.checkedOut}</Typography>
              <Typography variant="caption" color="text.secondary">Checked Out</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by employee name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
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
              renderOption={(props, option) => (
                <li {...props} key={option.value}>
                  {option.label}
                </li>
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Autocomplete
              fullWidth
              size="small"
              options={shiftOptions}
              value={shiftOptions.find(opt => opt.value === filterShift) || null}
              onChange={(event, newValue) => {
                setFilterShift(newValue?.value || "All");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Shift"
                  placeholder="Select shift"
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.value}>
                  {option.label}
                </li>
              )}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => {
                setFilterDepartment("All");
                setFilterShift("All");
                setSearchQuery("");
              }}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

<div className="flex justify-end mb-5">
              
            {/* Export Button - Only new addition */}
            <DownloadButtonGroup
              data={exportData}
              options={{
                fileName: `attendance_${new Date().toISOString().split('T')[0]}`,
                includeHeaders: true,
                pdfTitle: `Attendance Report - ${new Date().toLocaleDateString()}`
              }}
              variant="outlined"
              size="small"
              color="primary"
              
            />
</div>
      {/* Attendance Table */}
      <TableContainer component={Paper} >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>Employee</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell align="center">Check-In</TableCell>
              <TableCell align="center">Check-Out</TableCell>
              <TableCell align="center">Total Hours</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Location</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {filteredData.map((record) => (
              <TableRow 
                key={record.id}
                sx={{ 
                  '&:hover': { bgcolor: 'action.hover' },
                  ...(record.attendanceStatus === 'Late' && { bgcolor: '#fab1b1' }),
                  ...(record.attendanceStatus === 'Absent' && { bgcolor: 'error.lighter' })
                }}
              >
                {/* Employee */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      {record.employeeName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => onViewDetails?.(record)}
                      >
                        {record.employeeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {record.department} • {record.role}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                {/* Shift */}
                <TableCell>
                  <Typography variant="body2">{record.shiftName}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {record.shiftStartTime} - {record.shiftEndTime}
                  </Typography>
                </TableCell>
                
                {/* Check-In */}
                <TableCell align="center">
                  {record.checkInTime ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <PlayArrow fontSize="small" color="success" />
                      <Typography variant="body2" fontWeight={600}>
                        {record.checkInTime}
                      </Typography>
                      {record.lateMinutes && record.lateMinutes > 0 && (
                        <Tooltip title={`Late by ${record.lateMinutes} minutes`}>
                          <Chip label={`+${record.lateMinutes}m`} size="small" color="warning" />
                        </Tooltip>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Error fontSize="small" color="error" />
                      <Typography variant="body2" color="text.secondary">
                        Not checked in
                      </Typography>
                    </Box>
                  )}
                </TableCell>
                
                {/* Check-Out */}
                <TableCell align="center">
                  {record.checkOutTime ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Stop fontSize="small" color="info" />
                      <Typography variant="body2" fontWeight={600}>
                        {record.checkOutTime}
                      </Typography>
                    </Box>
                  ) : record.checkInTime ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <AccessTime fontSize="small" color="warning" />
                      <Typography variant="caption" color="text.secondary">
                        Still working
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                
                {/* Total Hours */}
                <TableCell align="center">
                  {record.checkInTime && record.checkOutTime ? (
                    <Typography variant="body2" fontWeight={600}>
                      {record.totalHours?.toFixed(2)}h
                    </Typography>
                  ) : record.checkInTime ? (
                    <Typography variant="caption" color="text.secondary">
                      In progress
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                
                {/* Status */}
                <TableCell align="center">
                  {getStatusBadge(record.attendanceStatus)}
                </TableCell>
                
                {/* Location */}
                <TableCell align="center">
                  {record.checkInLocation ? (
                    <Tooltip title={record.checkInLocation}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <LocationOn fontSize="small" />
                        <Typography variant="caption">
                          {record.checkInLocation.split(' ')[0]}
                        </Typography>
                      </Box>
                    </Tooltip>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
                
                {/* Actions */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => onViewDetails?.(record)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Edit Attendance">
                      <IconButton
                        size="small"
                        onClick={() => onEditAttendance?.(record)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {filteredData.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography>
            No attendance records found for the selected filters.
          </Typography>
        </Alert>
      )}

      {/* Footer Info */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Showing {filteredData.length} of {data.length} records
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Badge color="success" variant="dot" />
          <Typography variant="caption">Present</Typography>
          
          <Badge color="warning" variant="dot" sx={{ ml: 1 }} />
          <Typography variant="caption">Late</Typography>
          
          <Badge color="error" variant="dot" sx={{ ml: 1 }} />
          <Typography variant="caption">Absent</Typography>
          
          <Badge color="info" variant="dot" sx={{ ml: 1 }} />
          <Typography variant="caption">Half-Day</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LiveAttendanceMonitor;