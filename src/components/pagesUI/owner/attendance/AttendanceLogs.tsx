// AttendanceLogs.tsx
"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Tooltip,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Avatar,
  Autocomplete
} from "@mui/material";
import {
  Search,
  FilterList,
  Download,
  PictureAsPdf,
  CalendarMonth,
  Schedule,
  CheckCircle,
  Error,
  Edit,
  Visibility,
  Refresh,
  ArrowBack,
  ArrowForward,
  DateRange,
  Person
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { IAttendanceRecord, DEPARTMENTS, SHIFTS, calculateTotalHours } from "./AttendanceTypes";

interface AttendanceLogsProps {
  attendanceData?: IAttendanceRecord[];
  onExportCSV?: (data: IAttendanceRecord[]) => void;
  onExportPDF?: (data: IAttendanceRecord[]) => void;
  onEditRecord?: (record: IAttendanceRecord) => void;
  onViewCorrection?: (record: IAttendanceRecord) => void;
}

const AttendanceLogs: React.FC<AttendanceLogsProps> = ({
  attendanceData = [],
  onExportCSV,
  onExportPDF,
  onEditRecord,
  onViewCorrection
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterShift, setFilterShift] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [startDate, setStartDate] = useState<Date | null>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedEmployee, setSelectedEmployee] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Mock data
  const mockAttendanceData: IAttendanceRecord[] = useMemo(() => {
    const records: IAttendanceRecord[] = [];
    const today = new Date();
    
    // Generate 30 days of data
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Employee 1
      records.push({
        id: `1-${dateStr}`,
        employeeId: "EMP001",
        employeeName: "Rajesh Kumar",
        department: "Engineering",
        role: "Software Engineer",
        shiftId: 1,
        shiftName: "Morning Shift",
        shiftStartTime: "09:00",
        shiftEndTime: "18:00",
        date: dateStr,
        checkInTime: i % 5 === 0 ? undefined : "09:00",
        checkOutTime: i % 5 === 0 ? undefined : "18:00",
        totalHours: i % 5 === 0 ? 0 : 9,
        attendanceStatus: i % 5 === 0 ? "Absent" : "Present",
        isManualEntry: false,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
        correctionRequest: i === 2 ? {
          status: "Approved",
          requestedBy: "EMP001",
          requestedAt: date.toISOString(),
          reason: "Forgot to check-in",
          correctedCheckIn: "09:30",
          approvedBy: "HR001",
          approvedAt: date.toISOString(),
          notes: "Approved with note"
        } : undefined
      });
      
      // Employee 2
      records.push({
        id: `2-${dateStr}`,
        employeeId: "EMP002",
        employeeName: "Priya Sharma",
        department: "Marketing",
        role: "Marketing Manager",
        shiftId: 2,
        shiftName: "Evening Shift",
        shiftStartTime: "14:00",
        shiftEndTime: "22:00",
        date: dateStr,
        checkInTime: "14:15",
        checkOutTime: "22:00",
        totalHours: 7.75,
        attendanceStatus: "Late",
        lateMinutes: 15,
        isManualEntry: false,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString()
      });
    }
    
    return records;
  }, []);

  const data = attendanceData.length > 0 ? attendanceData : mockAttendanceData;

  // Prepare employee options for Autocomplete
  const employeeOptions = useMemo(() => {
    const uniqueEmployees = new Map();
    data.forEach(record => {
      if (!uniqueEmployees.has(record.employeeId)) {
        uniqueEmployees.set(record.employeeId, {
          label: `${record.employeeName} (${record.employeeId})`,
          value: record.employeeId,
          name: record.employeeName
        });
      }
    });
    return [{ label: "All Employees", value: "All" }, ...Array.from(uniqueEmployees.values())];
  }, [data]);

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

  // Prepare status options for Autocomplete
  const statusOptions = useMemo(() => [
    { label: "All Status", value: "All" },
    { label: "Present", value: "Present" },
    { label: "Absent", value: "Absent" },
    { label: "Late", value: "Late" },
    { label: "Half-Day", value: "Half-Day" },
    { label: "On Leave", value: "On Leave" }
  ], []);

  const filteredData = useMemo(() => {
    return data.filter(record => {
      // Filter by date range
      const recordDate = new Date(record.date);
      if (startDate && recordDate < startDate) return false;
      if (endDate && recordDate > endDate) return false;
      
      // Filter by department
      if (filterDepartment !== "All" && record.department !== filterDepartment) {
        return false;
      }
      
      // Filter by shift
      if (filterShift !== "All" && record.shiftName !== filterShift) {
        return false;
      }
      
      // Filter by status
      if (filterStatus !== "All" && record.attendanceStatus !== filterStatus) {
        return false;
      }
      
      // Filter by employee
      if (selectedEmployee !== "All" && record.employeeId !== selectedEmployee) {
        return false;
      }
      
      // Filter by search
      if (searchQuery && 
          !record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !record.employeeId.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [data, startDate, endDate, filterDepartment, filterShift, filterStatus, selectedEmployee, searchQuery]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Present':
        return <Chip label="Present" color="success" size="small" />;
      case 'Late':
        return <Chip label="Late" color="warning" size="small" />;
      case 'Absent':
        return <Chip label="Absent" color="error" size="small" />;
      case 'Half-Day':
        return <Chip label="Half-Day" color="info" size="small" />;
      case 'On Leave':
        return <Chip label="On Leave" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const handleExportCSV = () => {
    if (onExportCSV) {
      onExportCSV(filteredData);
    } else {
      // Default export implementation
      const headers = ['Date', 'Employee', 'Department', 'Shift', 'Check-In', 'Check-Out', 'Total Hours', 'Status'];
      const csvContent = [
        headers.join(','),
        ...filteredData.map(record => [
          record.date,
          `"${record.employeeName}"`,
          record.department,
          record.shiftName,
          record.checkInTime || '',
          record.checkOutTime || '',
          record.totalHours || 0,
          record.attendanceStatus
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const handleExportPDF = () => {
    if (onExportPDF) {
      onExportPDF(filteredData);
    } else {
      alert('PDF export would be implemented here');
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterDepartment("All");
    setFilterShift("All");
    setFilterStatus("All");
    setSelectedEmployee("All");
    setStartDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    setEndDate(new Date());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  const getAttendanceSummary = () => {
    const summary = {
      total: filteredData.length,
      present: filteredData.filter(r => r.attendanceStatus === 'Present').length,
      absent: filteredData.filter(r => r.attendanceStatus === 'Absent').length,
      late: filteredData.filter(r => r.attendanceStatus === 'Late').length,
      halfDay: filteredData.filter(r => r.attendanceStatus === 'Half-Day').length,
      averageHours: filteredData.reduce((sum, r) => sum + (r.totalHours || 0), 0) / (filteredData.length || 1)
    };
    
    return summary;
  };

  const summary = getAttendanceSummary();

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CalendarMonth /> Attendance Logs & Timesheet
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('list')}
                size="small"
                className="!text-white"
              >
                List View
              </Button>
              <Button
                variant={viewMode === 'calendar' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('calendar')}
                size="small"
              >
                Calendar View
              </Button>
            </Box>
          </Box>
          
          {/* Summary Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={4} md={2}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">{summary.total}</Typography>
                <Typography variant="caption" color="text.secondary">Total Records</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Paper sx={{ p: 2, textAlign: 'center', borderColor: 'success.main', border: 1 }}>
                <Typography variant="h6" color="success.main">{summary.present}</Typography>
                <Typography variant="caption" color="text.secondary">Present</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Paper sx={{ p: 2, textAlign: 'center', borderColor: 'error.main', border: 1 }}>
                <Typography variant="h6" color="error.main">{summary.absent}</Typography>
                <Typography variant="caption" color="text.secondary">Absent</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Paper sx={{ p: 2, textAlign: 'center', borderColor: 'warning.main', border: 1 }}>
                <Typography variant="h6" color="warning.main">{summary.late}</Typography>
                <Typography variant="caption" color="text.secondary">Late</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">{summary.halfDay}</Typography>
                <Typography variant="caption" color="text.secondary">Half-Day</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6} sm={4} md={2}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">{summary.averageHours.toFixed(1)}h</Typography>
                <Typography variant="caption" color="text.secondary">Avg Hours/Day</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={tabValue} 
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="fullWidth"
          >
            <Tab label="Daily View" />
            <Tab label="Monthly Summary" />
            <Tab label="Correction Requests" />
          </Tabs>
        </Paper>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by name or ID..."
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
            
            <Grid item xs={12} md={2}>
              <Autocomplete
                fullWidth
                size="small"
                options={employeeOptions}
                value={employeeOptions.find(opt => opt.value === selectedEmployee) || null}
                onChange={(event, newValue) => {
                  setSelectedEmployee(newValue?.value || "All");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Employee"
                    placeholder="Select employee"
                
                  />
                )}
                renderOption={(props, option) => (
                  <li 
                    {...props} 
                    key={option.value}
                  >
                    {option.label}
                  </li>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
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
                  <li 
                    {...props} 
                    key={option.value}
                  >
                    {option.label}
                  </li>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
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
                  <li 
                    {...props} 
                    key={option.value}
                  >
                    {option.label}
                  </li>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Autocomplete
                fullWidth
                size="small"
                options={statusOptions}
                value={statusOptions.find(opt => opt.value === filterStatus) || null}
                onChange={(event, newValue) => {
                  setFilterStatus(newValue?.value || "All");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Status"
                    placeholder="Select status"
                    className="text-md"
                   
                  />
                )}
                renderOption={(props, option) => (
                  <li 
                    {...props} 
                    key={option.value}
                  >
                    {option.label}
                  </li>
                )}
              />
            </Grid>
          </Grid>
          
          <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="From Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
            
            <Grid item xs={12} md={3}>
              <DatePicker
                label="To Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ textField: { size: 'small', fullWidth: true } }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={handleClearFilters}
                fullWidth
              >
                Clear Filters
              </Button>
            </Grid>
            
            <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<Download />}
                onClick={handleExportCSV}
                className="!text-white"
              >
                Export CSV
              </Button>
              
              <Button
                variant="contained"
                startIcon={<PictureAsPdf />}
                onClick={handleExportPDF}
                color="secondary"
                className="!text-white"
              >
                Export PDF
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Table */}
        {viewMode === 'list' ? (
          <TableContainer component={Paper}>
  <Table
    sx={{
      '& .MuiTableCell-root': {
        color: '#000',
      },
      '& .MuiTypography-root': {
        color: '#000',
      },
    }}
  >
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell>Date</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Shift</TableCell>
                  <TableCell align="center">Check-In</TableCell>
                  <TableCell align="center">Check-Out</TableCell>
                  <TableCell align="center">Total Hours</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Correction</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              
              <TableBody>
                {paginatedData.map((record) => (
                  <TableRow 
                    key={record.id}
                    hover
                    sx={{ 
                      ...(record.attendanceStatus === 'Late' && { bgcolor: '#fab1b1'}),
                      ...(record.attendanceStatus === 'Absent' && { bgcolor: 'error.lighter' })
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(record.date)}
                      </Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                          {record.employeeName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {record.employeeName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {record.employeeId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">{record.department}</Typography>
                    </TableCell>
                    
                    <TableCell>
                      <Typography variant="body2">{record.shiftName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {record.shiftStartTime} - {record.shiftEndTime}
                      </Typography>
                    </TableCell>
                    
                    <TableCell align="center">
                      {record.checkInTime ? (
                        <Typography variant="body2" fontWeight={600}>
                          {record.checkInTime}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell align="center">
                      {record.checkOutTime ? (
                        <Typography variant="body2" fontWeight={600}>
                          {record.checkOutTime}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell align="center">
                      {record.totalHours ? (
                        <Typography variant="body2" fontWeight={600}>
                          {record.totalHours.toFixed(2)}h
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell align="center">
                      {getStatusBadge(record.attendanceStatus)}
                      {record.lateMinutes && record.lateMinutes > 0 && (
                        <Tooltip title={`Late by ${record.lateMinutes} minutes`}>
                          <Schedule fontSize="small" color="warning" sx={{ ml: 0.5 }} />
                        </Tooltip>
                      )}
                    </TableCell>
                    
                    <TableCell align="center">
                      {record.correctionRequest ? (
                        <Tooltip 
                          title={
                            <Box>
                              <Typography variant="caption">
                                {record.correctionRequest.reason}
                              </Typography>
                              <br />
                              <Typography variant="caption">
                                {record.correctionRequest.status} by {record.correctionRequest.approvedBy}
                              </Typography>
                            </Box>
                          }
                        >
                          <Chip
                            label={record.correctionRequest.status}
                            size="small"
                            color={
                              record.correctionRequest.status === 'Approved' ? 'success' :
                              record.correctionRequest.status === 'Rejected' ? 'error' : 'warning'
                            }
                          />
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          —
                        </Typography>
                      )}
                    </TableCell>
                    
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => onViewCorrection?.(record)}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Edit Record">
                          <IconButton
                            size="small"
                            onClick={() => onEditRecord?.(record)}
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
            
            <TablePagination
              component="div"
              count={filteredData.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </TableContainer>
        ) : (
          // Calendar View (simplified)
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Calendar View - Under Development
            </Typography>
            <Alert severity="info">
              Calendar view for attendance visualization is coming soon.
            </Alert>
          </Paper>
        )}

        {/* Empty State */}
        {filteredData.length === 0 && (
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography>
              No attendance records found for the selected filters.
            </Typography>
          </Alert>
        )}
      </Box>
    </LocalizationProvider>
  );
};

export default AttendanceLogs;