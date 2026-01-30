// EmployeeAttendanceTable.tsx
"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Chip,
  Alert,
  Tooltip,
  Autocomplete,
  TextField,
  CircularProgress,
  IconButton
} from "@mui/material";
import { Download, FilterList, CalendarMonth, Refresh } from "@mui/icons-material";
import AttendanceTypeIcons from "../../hrm/attendance/AttendanceTypeIcons";
import axios from "axios";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface AttendanceDay {
  status: 'holiday' | 'dayoff' | 'present' | 'halfday' | 'late' | 'absent' | 'onleave';
  checkIn?: string;
  checkOut?: string;
  hours?: number;
  notes?: string;
}

interface EmployeeAttendance {
  id: string;
  name: string;
  department: string;
  role: string;
  attendance: AttendanceDay[];
}

// Interface for API response
interface ApiAttendanceRecord {
  attendance_id: number;
  attendance_date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  leave_id: number | null;
  actions: {
    shift: {
      shift_id: number;
    };
    punches: {
      check_in?: {
        time: string;
        location: string;
        source: string;
      };
      check_out?: {
        time: string;
        location: string;
        source: string;
      };
    };
    manual: {
      is_manual_entry: boolean;
    };
  };
  created_at: string;
  updated_at: string;
}

interface ApiEmployeeData {
  employee_id: number;
  employee_code: string;
  employee_name: string;
  designation: string;
  records: ApiAttendanceRecord[];
}

interface ApiResponse {
  message: string;
  error: {
    errorCode: number;
    errorMessage: string;
    errorIdentifier: string;
  };
  data: ApiEmployeeData[];
}

const EmployeeAttendanceTable = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<ApiEmployeeData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get<ApiResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/attendance/summary/monthly`,
        {
          params: {
            month: selectedMonth.toString().padStart(2, '0'),
            year: selectedYear,
            client_id: 27
          }
        }
      );
      
      if (response.data.error.errorCode === 0) {
        setApiData(response.data.data);
      } else {
        throw new Error(response.data.error.errorMessage || 'Failed to fetch attendance data');
      }
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  // Transform API data to match component format
  const generateEmployeeData = useMemo(() => {
    if (!apiData || apiData.length === 0) {
      return [];
    }

    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    
    return apiData.map((employee): EmployeeAttendance => {
      // Create a map of attendance by day for easy lookup
      const attendanceByDate = new Map<string, ApiAttendanceRecord>();
      employee.records.forEach(record => {
        const date = new Date(record.attendance_date);
        const day = date.getDate();
        attendanceByDate.set(day.toString(), record);
      });

      // Generate attendance array for all days in month
      const attendance: AttendanceDay[] = Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const date = new Date(selectedYear, selectedMonth - 1, day);
        const dayOfWeek = date.getDay();
        
        // Weekends are day off
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          return { status: 'dayoff' as const };
        }

        // Check if we have API record for this day
        const apiRecord = attendanceByDate.get(day.toString());
        
        if (apiRecord) {
          // Map API status to component status
          let status: AttendanceDay['status'];
          switch (apiRecord.status.toLowerCase()) {
            case 'present':
              status = 'present';
              break;
            case 'absent':
              status = 'absent';
              break;
            case 'half day':
            case 'halfday':
              status = 'halfday';
              break;
            case 'late':
              status = 'late';
              break;
            case 'leave':
              status = 'onleave';
              break;
            default:
              status = 'absent';
          }

          // Calculate hours worked
          let hours = 0;
          if (apiRecord.check_in && apiRecord.check_out) {
            const checkInTime = apiRecord.check_in;
            const checkOutTime = apiRecord.check_out;
            
            // Parse time strings (HH:mm format)
            const [checkInHour, checkInMinute] = checkInTime.split(':').map(Number);
            const [checkOutHour, checkOutMinute] = checkOutTime.split(':').map(Number);
            
            const checkInDate = new Date(selectedYear, selectedMonth - 1, day, checkInHour, checkInMinute);
            const checkOutDate = new Date(selectedYear, selectedMonth - 1, day, checkOutHour, checkOutMinute);
            
            hours = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60);
            
            // Adjust for lunch break if needed (e.g., subtract 1 hour)
            if (hours > 4) {
              hours -= 1; // Subtract lunch hour
            }
          }

          return {
            status,
            checkIn: apiRecord.check_in || undefined,
            checkOut: apiRecord.check_out || undefined,
            hours: hours > 0 ? hours : undefined,
            notes: apiRecord.leave_id ? `Leave ID: ${apiRecord.leave_id}` : undefined
          };
        }

        // If no API record and it's a weekday, mark as absent
        return { status: 'absent' as const };
      });

      return {
        id: employee.employee_code,
        name: employee.employee_name,
        department: "Engineering", // You might need to get this from another API
        role: employee.designation,
        attendance
      };
    });
  }, [apiData, selectedMonth, selectedYear]);

  const filteredEmployees = useMemo(() => {
    return generateEmployeeData.filter(employee => {
      if (filterDepartment !== "All" && employee.department !== filterDepartment) {
        return false;
      }
      
      if (filterStatus !== "All") {
        const hasStatus = employee.attendance.some(day => day.status === filterStatus);
        if (!hasStatus) return false;
      }
      
      return true;
    });
  }, [generateEmployeeData, filterDepartment, filterStatus]);

  // Get unique departments for Autocomplete
  const departments = useMemo(() => {
    const depts = Array.from(new Set(generateEmployeeData.map(emp => emp.department)));
    return [{ label: "All Departments", value: "All" }, ...depts.map(dept => ({ label: dept, value: dept }))];
  }, [generateEmployeeData]);

  // Status options for Autocomplete
  const statusOptions = useMemo(() => [
    { label: "All Status", value: "All" },
    { label: "Holiday", value: "holiday" },
    { label: "Day Off", value: "dayoff" },
    { label: "Present", value: "present" },
    { label: "Half Day", value: "halfday" },
    { label: "Late", value: "late" },
    { label: "Absent", value: "absent" },
    { label: "On Leave", value: "onleave" }
  ], []);

  // Month options for Autocomplete
  const monthOptions = useMemo(() => 
    months.map((month, index) => ({ label: month, value: index + 1 })), []
  );

  // Year options for Autocomplete
  const yearOptions = useMemo(() => 
    [2023, 2024, 2025, 2026].map(year => ({ label: year.toString(), value: year })), []
  );

  // Helper function to get icon class based on status
  const getAttendanceClass = (status: string) => {
    switch(status) {
      case 'holiday': return "fa fa-star text-primary";
      case 'dayoff': return "fa fa-calendar-week text-secondary";
      case 'present': return "fa fa-check text-success";
      case 'halfday': return "fa fa-star-half-alt text-info";
      case 'late': return "fa fa-exclamation-circle text-warning";
      case 'absent': return "fa fa-times text-danger";
      case 'onleave': return "fa fa-plane-departure text-link";
      default: return "fa fa-question text-gray";
    }
  };

  // Helper function to get tooltip text
  const getTooltipText = (day: AttendanceDay, dateIndex: number) => {
    const dateStr = `${dateIndex + 1} ${months[selectedMonth - 1]} ${selectedYear}`;
    
    switch(day.status) {
      case 'holiday': return `${dateStr} - Public Holiday`;
      case 'dayoff': return `${dateStr} - Weekly Off`;
      case 'present': return `${dateStr} - Present (${day.checkIn || '?'} to ${day.checkOut || '?'})`;
      case 'halfday': return `${dateStr} - Half Day (${day.hours || 0} hours)`;
      case 'late': return `${dateStr} - Late Arrival (${day.checkIn || '?'})`;
      case 'absent': return `${dateStr} - Absent`;
      case 'onleave': return `${dateStr} - On Leave`;
      default: return dateStr;
    }
  };

  const handleExportCSV = () => {
    const headers = ['Employee', 'Department', 'Role', ...Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`)];
    const csvContent = [
      headers.join(','),
      ...filteredEmployees.map(employee => [
        `"${employee.name}"`,
        employee.department,
        employee.role,
        ...employee.attendance.map(day => {
          // Map status to single character codes
          const statusCodes: Record<string, string> = {
            'holiday': 'H',
            'dayoff': 'O',
            'present': 'P',
            'halfday': 'HD',
            'late': 'L',
            'absent': 'A',
            'onleave': 'L'
          };
          return statusCodes[day.status] || day.status.charAt(0).toUpperCase();
        })
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${months[selectedMonth - 1]}_${selectedYear}.csv`;
    a.click();
  };

  // Calculate summary for an employee
  const calculateSummary = (attendance: AttendanceDay[]) => {
    const summary = {
      holiday: attendance.filter(day => day.status === 'holiday').length,
      dayoff: attendance.filter(day => day.status === 'dayoff').length,
      present: attendance.filter(day => day.status === 'present').length,
      halfday: attendance.filter(day => day.status === 'halfday').length,
      late: attendance.filter(day => day.status === 'late').length,
      absent: attendance.filter(day => day.status === 'absent').length,
      onleave: attendance.filter(day => day.status === 'onleave').length,
      totalHours: attendance.reduce((sum, day) => sum + (day.hours || 0), 0)
    };
    
    return summary;
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CalendarMonth /> Monthly Attendance Report
        </Typography>
        
        {/* Month & Year Selection */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="subtitle2">Select Period:</Typography>
            
            <Autocomplete
              size="small"
              options={monthOptions}
              value={monthOptions.find(opt => opt.value === selectedMonth) || null}
              onChange={(event, newValue) => {
                setSelectedMonth(newValue?.value || 1);
              }}
              sx={{ minWidth: 140 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Month"
                  placeholder="Select month"
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
            
            <Autocomplete
              size="small"
              options={yearOptions}
              value={yearOptions.find(opt => opt.value === selectedYear) || null}
              onChange={(event, newValue) => {
                setSelectedYear(newValue?.value || 2024);
              }}
              sx={{ minWidth: 100 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Year"
                  placeholder="Select year"
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
            
            <Chip 
              label={`${months[selectedMonth - 1]} ${selectedYear}`}
              color="primary"
              variant="outlined"
            />
            
            <IconButton
              onClick={fetchAttendanceData}
              disabled={loading}
              sx={{ ml: 1 }}
            >
              <Refresh />
            </IconButton>
            
            <Box sx={{ flexGrow: 1 }} />
            
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  Loading...
                </Typography>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                {filteredEmployees.length} employees • {new Date(selectedYear, selectedMonth, 0).getDate()} days
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Attendance Type Icons Legend */}
      <AttendanceTypeIcons />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2">
            Error loading attendance data: {error}
          </Typography>
          <Button 
            size="small" 
            onClick={fetchAttendanceData} 
            sx={{ mt: 1 }}
            disabled={loading}
          >
            Retry
          </Button>
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="subtitle2">Filters:</Typography>
          
          <Autocomplete
            size="small"
            options={departments}
            value={departments.find(opt => opt.value === filterDepartment) || null}
            onChange={(event, newValue) => {
              setFilterDepartment(newValue?.value || "All");
            }}
            sx={{ minWidth: 140 }}
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
          
          <Autocomplete
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
          
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={() => {
              setFilterDepartment("All");
              setFilterStatus("All");
            }}
          >
            Clear Filters
          </Button>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExportCSV}
            className="!text-white"
            disabled={loading || filteredEmployees.length === 0}
          >
            Export CSV
          </Button>
        </Box>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Attendance Table */}
      {!loading && filteredEmployees.length > 0 && (
        <>
          <TableContainer component={Paper} sx={{ maxHeight: 600, overflow: 'auto' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ 
                    position: 'sticky', 
                    left: 0, 
                    zIndex: 5, 
                    bgcolor: 'background.paper', 
                    minWidth: 200,
                    borderRight: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Employee / Date
                    </Typography>
                  </TableCell>
                  
                  {/* Day Headers */}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => {
                    const date = new Date(selectedYear, selectedMonth - 1, day);
                    const dayOfWeek = date.getDay();
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    
                    return (
                      <TableCell 
                        key={day} 
                        align="center"
                        sx={{ 
                          minWidth: 60,
                          maxWidth: 60,
                          bgcolor: isWeekend ? 'grey.50' : 'background.paper',
                          borderLeft: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="caption" fontWeight={600} display="block">
                          {day}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          display="block" 
                          color={isWeekend ? 'error.main' : 'text.secondary'}
                          sx={{ fontSize: '0.7rem' }}
                        >
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dayOfWeek]}
                        </Typography>
                      </TableCell>
                    );
                  })}
                  
                  <TableCell align="center" sx={{ 
                    minWidth: 120,
                    position: 'sticky',
                    right: 0,
                    bgcolor: 'background.paper',
                    borderLeft: '1px solid',
                    borderColor: 'divider'
                  }}>
                    <Typography variant="subtitle2" fontWeight={600}>
                      Summary
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              
              <TableBody>
                {filteredEmployees.map((employee) => {
                  const summary = calculateSummary(employee.attendance);
                  
                  return (
                    <TableRow key={employee.id} hover>
                      {/* Employee Info */}
                      <TableCell sx={{ 
                        position: 'sticky', 
                        left: 0, 
                        zIndex: 4, 
                        bgcolor: 'background.paper',
                        borderRight: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {employee.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {employee.role}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {employee.id}
                          </Typography>
                        </Box>
                      </TableCell>
                      
                      {/* Daily Attendance with Icons */}
                      {employee.attendance.map((day, dayIndex) => (
                        <TableCell 
                          key={dayIndex} 
                          align="center"
                          sx={{ 
                            bgcolor: day.status === 'holiday' ? 'primary.50' : 
                                    day.status === 'dayoff' ? 'grey.50' : 
                                    'background.paper',
                            borderLeft: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Tooltip title={getTooltipText(day, dayIndex)} arrow>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <i className={getAttendanceClass(day.status)} style={{ fontSize: '18px' }}></i>
                              {day.hours && day.hours > 0 && (
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>
                                  {day.hours.toFixed(1)}h
                                </Typography>
                              )}
                            </Box>
                          </Tooltip>
                        </TableCell>
                      ))}
                      
                      {/* Fill remaining days if month has less than 31 days */}
                      {Array.from({ length: Math.max(0, 31 - employee.attendance.length) }, (_, i) => (
                        <TableCell key={`empty-${i}`} align="center">—</TableCell>
                      ))}
                      
                      {/* Summary Column - Fixed on right */}
                      <TableCell align="center" sx={{ 
                        position: 'sticky',
                        right: 0,
                        bgcolor: 'background.paper',
                        borderLeft: '1px solid',
                        borderColor: 'divider'
                      }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {/* Present */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <i className="fa fa-check text-success" style={{ fontSize: '12px' }}></i>
                            <Typography variant="caption" fontWeight={600}>
                              {summary.present}
                            </Typography>
                          </Box>
                          
                          {/* Absent */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <i className="fa fa-times text-danger" style={{ fontSize: '12px' }}></i>
                            <Typography variant="caption">
                              {summary.absent}
                            </Typography>
                          </Box>
                          
                          {/* Working Hours */}
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              {summary.totalHours.toFixed(1)}h
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Overall Summary */}
          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Monthly Summary:</Typography>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" color="text.secondary">Total Employees</Typography>
                <Typography variant="h6">{filteredEmployees.length}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" color="text.secondary">Average Present %</Typography>
                <Typography variant="h6">
                  {Math.round(filteredEmployees.reduce((sum, emp) => {
                    const summary = calculateSummary(emp.attendance);
                    const totalDays = emp.attendance.length;
                    const presentDays = summary.present + summary.halfday * 0.5;
                    return sum + (presentDays / totalDays * 100);
                  }, 0) / filteredEmployees.length)}%
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" color="text.secondary">Total Work Hours</Typography>
                <Typography variant="h6">
                  {filteredEmployees.reduce((sum, emp) => 
                    sum + calculateSummary(emp.attendance).totalHours, 0
                  ).toFixed(0)}h
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" color="text.secondary">Late Entries</Typography>
                <Typography variant="h6" color="warning.main">
                  {filteredEmployees.reduce((sum, emp) => 
                    sum + calculateSummary(emp.attendance).late, 0
                  )}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" color="text.secondary">Absent Days</Typography>
                <Typography variant="h6" color="error.main">
                  {filteredEmployees.reduce((sum, emp) => 
                    sum + calculateSummary(emp.attendance).absent, 0
                  )}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </>
      )}

      {/* Empty State */}
      {!loading && filteredEmployees.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography>
            No attendance records found for the selected filters.
          </Typography>
        </Alert>
      )}
    </Box>
  );
};

export default EmployeeAttendanceTable;