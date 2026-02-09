// LeaveManagement.tsx - UPDATED VERSION
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TablePagination,
  Card,
  CardContent,
  Autocomplete,
  CircularProgress,
  Snackbar,
  Badge,
  Divider,
  Stack,
  Tabs,
  Tab,
  Switch,
  FormControlLabel,
  LinearProgress
} from "@mui/material";
import {
  Search,
  FilterList,
  CheckCircle,
  Cancel,
  Pending,
  Visibility,
  Add,
  Edit,
  Delete,
  CalendarMonth,
  Person,
  Download,
  Refresh,
  MoreVert,
  EventBusy,
  EventAvailable,
  ArrowUpward,
  ArrowDownward,
  FileDownload,
  PictureAsPdf,
  DateRange,
  Today,
  FilterAlt,
  Sort,
  AccountCircle,
  Work,
  AccessTime,
  Warning,
  Info
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ILeaveRequest, ILeaveBalance, ILeaveStats } from "./AttendanceTypes";
import { getLeaveRequests, getLeaveBalance, updateLeaveRequest, deleteLeaveRequest } from "./attendanceApi";

interface LeaveManagementProps {
  onApprove?: (leaveId: number) => void;
  onReject?: (leaveId: number) => void;
  onCreate?: () => void;
  onViewDetails?: (leave: ILeaveRequest) => void;
  onExport?: (data: ILeaveRequest[]) => void;
}

// Interface for API response
interface ApiLeaveRequest {
  leave_id: number;
  employee: {
    info: {
      employee_id: number;
      first_name: string;
      last_name: string;
      designation: string;
      email: string;
      employee_code: string;
      date_of_joining: string;
    };
    salary_structure: any;
    attributes: Array<{
      attribute_key: string;
      attribute_value: string;
    }>;
  } | null;
  start_date: string;
  end_date: string;
  leave_type: string;
  reason: string;
  status: string;
  approved_on: string | null;
  approved_by: number | null;
  created_at: string;
  updated_at: string;
}

const LeaveManagement: React.FC<LeaveManagementProps> = ({
  onApprove,
  onReject,
  onCreate,
  onViewDetails,
  onExport
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterLeaveType, setFilterLeaveType] = useState("All");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [leaves, setLeaves] = useState<ILeaveRequest[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<ILeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedLeave, setSelectedLeave] = useState<ILeaveRequest | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  const [stats, setStats] = useState<ILeaveStats>({
    totalRequests: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
    onLeaveToday: 0
  });
  const [leaveTypes, setLeaveTypes] = useState<string[]>([]);
  const [sortField, setSortField] = useState<'start_date' | 'employee_name' | 'status'>('start_date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showOnlyPending, setShowOnlyPending] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Transform API response to ILeaveRequest format
  const transformApiResponse = (apiData: ApiLeaveRequest[]): ILeaveRequest[] => {
    return apiData.map(item => {
      const employee = item.employee;
      
      return {
        leave_id: item.leave_id,
        employee_id: employee?.info?.employee_id || 0,
        employee_code: employee?.info?.employee_code || 'N/A',
        employee_name: employee 
          ? `${employee.info.first_name || ''} ${employee.info.last_name || ''}`.trim()
          : 'Unknown Employee',
        designation: employee?.info?.designation || 'N/A',
        department: employee?.attributes?.find(attr => attr.attribute_key === 'work_location')?.attribute_value || 'N/A',
        leave_type: item.leave_type,
        start_date: item.start_date,
        end_date: item.end_date,
        reason: item.reason,
        status: item.status as 'Pending' | 'Approved' | 'Rejected' | 'Cancelled',
        approved_by: item.approved_by ?? undefined,
        // approved_by_name: null, // This would need additional API call
        approved_on: item.approved_on || undefined,
        created_at: item.created_at,
        updated_at: item.updated_at,
        duration_days: calculateDuration(item.start_date, item.end_date),
        applied_on: item.created_at
      };
    });
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchLeaveRequests(),
        fetchLeaveBalance(),
        fetchLeaveStats()
      ]);
    } catch (error) {
      console.error('Error fetching leave data:', error);
      showSnackbar('Failed to load leave data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch leave requests
  const fetchLeaveRequests = async () => {
    try {
      const params: any = {};
      if (filterStatus !== "All") params.status = filterStatus;
      if (filterLeaveType !== "All") params.leave_type = filterLeaveType;
      if (startDate) params.start_date = startDate.toISOString().split('T')[0];
      if (endDate) params.end_date = endDate.toISOString().split('T')[0];

      const response = await getLeaveRequests(params);
      
      if (response && response.data) {
        const transformedData = transformApiResponse(response.data);
        setLeaves(transformedData);
        
        // Extract unique leave types
        const types = new Set<string>();
        response.data.forEach((leave: ApiLeaveRequest) => {
          if (leave.leave_type) types.add(leave.leave_type);
        });
        setLeaveTypes(Array.from(types));
      }
    } catch (error) {
      console.error('Error fetching leave requests:', error);
      showSnackbar('Failed to fetch leave requests', 'error');
    }
  };

  // Fetch leave balance
  const fetchLeaveBalance = async () => {
    try {
      const response = await getLeaveBalance();
      if (response && response.data) {
        setLeaveBalance(response.data);
      }
    } catch (error) {
      console.error('Error fetching leave balance:', error);
      // Don't show error for balance as it might not be critical
    }
  };

  // Fetch leave statistics
  const fetchLeaveStats = async () => {
    try {
      setStatsLoading(true);
      
      // Get all leaves for stats
      const allLeavesResponse = await getLeaveRequests();
      if (allLeavesResponse && allLeavesResponse.data) {
        const apiData = allLeavesResponse.data;
        
        // Calculate stats
        const totalRequests = apiData.length;
        const pending = apiData.filter((item: ApiLeaveRequest) => 
          item.status === 'Pending' || item.status === 'Ap'
        ).length;
        const approved = apiData.filter((item: ApiLeaveRequest) => 
          item.status === 'Approved' || item.status === 'App'
        ).length;
        const rejected = apiData.filter((item: ApiLeaveRequest) => 
          item.status === 'Rejected' || item.status === 'Re'
        ).length;
        const cancelled = apiData.filter((item: ApiLeaveRequest) => 
          item.status === 'Cancelled'
        ).length;
        
        // Calculate employees on leave today
        const today = new Date().toISOString().split('T')[0];
        const onLeaveToday = apiData.filter((item: ApiLeaveRequest) => {
          const start = new Date(item.start_date);
          const end = new Date(item.end_date);
          const todayDate = new Date(today);
          
          const isApproved = item.status === 'Approved' || item.status === 'App';
          const isOnLeave = start <= todayDate && todayDate <= end;
          
          return isApproved && isOnLeave;
        }).length;
        
        setStats({
          totalRequests,
          pending,
          approved,
          rejected,
          cancelled,
          onLeaveToday
        });
      }
    } catch (error) {
      console.error('Error fetching leave stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  // Handle snackbar
  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle approve leave
  const handleApprove = async (leaveId: number) => {
    try {
      setActionLoading(leaveId);
      const payload = {
        status: 'Approved',
        // approved_by: 1, // Replace with actual user ID from auth
        approved_on: new Date().toISOString()
      };

      const response = await updateLeaveRequest(leaveId, payload);
      
      if (response && response.data) {
        showSnackbar('Leave request approved successfully', 'success');
        
        // Refresh data
        await fetchData();
        
        // Call parent callback
        if (onApprove) onApprove(leaveId);
      }
    } catch (error: any) {
      console.error('Error approving leave:', error);
      showSnackbar(error.message || 'Failed to approve leave request', 'error');
    } finally {
      setActionLoading(null);
      setApproveDialogOpen(false);
    }
  };

  // Handle reject leave
  const handleReject = async (leaveId: number) => {
    try {
      setActionLoading(leaveId);
      const payload = {
        status: 'Rejected',
        approved_by: 1, // Replace with actual user ID from auth
        approved_on: new Date().toISOString()
      };

      const response = await updateLeaveRequest(leaveId, payload);
      
      if (response && response.data) {
        showSnackbar('Leave request rejected successfully', 'success');
        
        // Refresh data
        await fetchData();
        
        // Call parent callback
        if (onReject) onReject(leaveId);
      }
    } catch (error: any) {
      console.error('Error rejecting leave:', error);
      showSnackbar(error.message || 'Failed to reject leave request', 'error');
    } finally {
      setActionLoading(null);
      setRejectDialogOpen(false);
    }
  };

  // Handle delete leave
  const handleDelete = async (leaveId: number) => {
    try {
      setActionLoading(leaveId);
      await deleteLeaveRequest(leaveId);
      
      showSnackbar('Leave request deleted successfully', 'success');
      
      // Refresh data
      await fetchData();
    } catch (error: any) {
      console.error('Error deleting leave:', error);
      showSnackbar(error.message || 'Failed to delete leave request', 'error');
    } finally {
      setActionLoading(null);
      setDeleteDialogOpen(false);
    }
  };

  // Calculate duration in days
  const calculateDuration = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = [...leaves];
    
    // Filter by search query
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(leave => {
        return (
          leave.employee_name?.toLowerCase().includes(searchLower) ||
          leave.employee_code?.toLowerCase().includes(searchLower) ||
          leave.leave_type?.toLowerCase().includes(searchLower) ||
          leave.reason?.toLowerCase().includes(searchLower) ||
          leave.designation?.toLowerCase().includes(searchLower)
        );
      });
    }
    
    // Filter by status
    if (filterStatus !== "All") {
      filtered = filtered.filter(leave => leave.status === filterStatus);
    }
    
    // Filter by leave type
    if (filterLeaveType !== "All") {
      filtered = filtered.filter(leave => leave.leave_type === filterLeaveType);
    }
    
    // Filter by date range
    if (startDate) {
      filtered = filtered.filter(leave => {
        const leaveStartDate = new Date(leave.start_date);
        return leaveStartDate >= startDate;
      });
    }
    
    if (endDate) {
      filtered = filtered.filter(leave => {
        const leaveEndDate = new Date(leave.end_date);
        return leaveEndDate <= endDate;
      });
    }
    
    // Show only pending
    if (showOnlyPending) {
      filtered = filtered.filter(leave => leave.status === 'Pending');
    }
    
    // Sort data
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortField) {
        case 'start_date':
          aValue = new Date(a.start_date);
          bValue = new Date(b.start_date);
          break;
        case 'employee_name':
          aValue = a.employee_name.toLowerCase();
          bValue = b.employee_name.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.start_date);
          bValue = new Date(b.start_date);
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [leaves, searchQuery, filterStatus, filterLeaveType, startDate, endDate, showOnlyPending, sortField, sortDirection]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Status options for Autocomplete
  const statusOptions = useMemo(() => [
    { label: "All Status", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
    { label: "Cancelled", value: "Cancelled" }
  ], []);

  // Leave type options for Autocomplete
  const leaveTypeOptions = useMemo(() => [
    { label: "All Types", value: "All" },
    ...leaveTypes.map(type => ({ label: type, value: type }))
  ], [leaveTypes]);

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending':
      case 'Ap': // Handle abbreviated status from API
        return (
          <Chip 
            icon={<Pending />} 
            label="Pending" 
            color="warning" 
            size="small" 
            sx={{ fontWeight: 500 }}
          />
        );
      case 'Approved':
      case 'App': // Handle abbreviated status from API
        return (
          <Chip 
            icon={<CheckCircle />} 
            label="Approved" 
            color="success" 
            size="small" 
            sx={{ fontWeight: 500 }}
          />
        );
      case 'Rejected':
      case 'Re': // Handle abbreviated status from API
        return (
          <Chip 
            icon={<Cancel />} 
            label="Rejected" 
            color="error" 
            size="small" 
            sx={{ fontWeight: 500 }}
          />
        );
      case 'Cancelled':
        return (
          <Chip 
            label="Cancelled" 
            color="default" 
            size="small" 
            sx={{ fontWeight: 500 }}
          />
        );
      default:
        return <Chip label={status} size="small" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Format date with day
  const formatDateWithDay = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Get avatar initials
  const getAvatarInitials = (name: string) => {
    if (!name || name === 'Unknown Employee') return '?';
    const initials = name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
    return initials || '?';
  };

  // Get avatar color based on employee name
  const getAvatarColor = (name: string) => {
    if (!name) return 'primary.main';
    
    const colors = [
      'primary.main',
      'secondary.main',
      'success.main',
      'error.main',
      'warning.main',
      'info.main',
      'primary.dark',
      'secondary.dark'
    ];
    
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Handle export CSV
  const handleExportCSV = () => {
    const headers = [
      'Leave ID',
      'Employee Name',
      'Employee Code',
      'Designation',
      'Department',
      'Leave Type',
      'Start Date',
      'End Date',
      'Duration',
      'Reason',
      'Status',
      'Applied On',
      'Approved/Rejected On'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredData.map(leave => [
        leave.leave_id,
        `"${leave.employee_name}"`,
        leave.employee_code,
        `"${leave.designation}"`,
        `"${leave.department}"`,
        leave.leave_type,
        leave.start_date,
        leave.end_date,
        calculateDuration(leave.start_date, leave.end_date),
        `"${leave.reason}"`,
        leave.status,
        formatDate(leave.created_at),
        leave.approved_on ? formatDate(leave.approved_on) : ''
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leave_requests_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterStatus("All");
    setFilterLeaveType("All");
    setStartDate(null);
    setEndDate(null);
    setShowOnlyPending(false);
    setPage(0);
  };

  // Set filter to show today's leaves
  const handleShowTodayLeaves = () => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
    setPage(0);
  };

  // Set filter to show this week's leaves
  const handleShowThisWeekLeaves = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
    
    setStartDate(startOfWeek);
    setEndDate(endOfWeek);
    setPage(0);
  };

  // Set filter to show this month's leaves
  const handleShowThisMonthLeaves = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    setStartDate(startOfMonth);
    setEndDate(endOfMonth);
    setPage(0);
  };

  // Handle sort
  const handleSort = (field: 'start_date' | 'employee_name' | 'status') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Get status count
  const getStatusCount = () => {
    const pending = leaves.filter(l => l.status === 'Pending').length;
    const approved = leaves.filter(l => l.status === 'Approved').length;
    const rejected = leaves.filter(l => l.status === 'Rejected').length;
    const cancelled = leaves.filter(l => l.status === 'Cancelled').length;
    return { pending, approved, rejected, cancelled };
  };

  const statusCount = getStatusCount();

  // Auto-refresh when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) {
        fetchLeaveRequests();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filterStatus, filterLeaveType, startDate, endDate]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600 }}>
              <EventBusy sx={{ color: 'primary.main' }} /> Leave Management
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Refresh Data">
                <IconButton
                  onClick={fetchData}
                  disabled={loading}
                  size="small"
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
              
              {/* <Button
                variant="contained"
                startIcon={<Add />}
                onClick={onCreate}
                className="!text-white"
                size="small"
              >
                New Leave
              </Button> */}
            </Box>
          </Box>
          
          {/* Quick Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6} sm={4} md={2}>
              <Card>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="primary.main" fontWeight={600}>
                    {stats.totalRequests}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Total</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={4} md={2}>
              <Card sx={{ borderColor: 'warning.main', border: 1 }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="warning.main" fontWeight={600}>
                    {stats.pending}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Pending</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={4} md={2}>
              <Card sx={{ borderColor: 'success.main', border: 1 }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="success.main" fontWeight={600}>
                    {stats.approved}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Approved</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={4} md={2}>
              <Card sx={{ borderColor: 'error.main', border: 1 }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="error.main" fontWeight={600}>
                    {stats.rejected}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Rejected</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={4} md={2}>
              <Card>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" fontWeight={600}>
                    {stats.cancelled}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Cancelled</Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} sm={4} md={2}>
              <Card sx={{ borderColor: 'info.main', border: 1 }}>
                <CardContent sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h6" color="info.main" fontWeight={600}>
                    {stats.onLeaveToday}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">On Leave Today</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        {/* Filters and Controls */}
        <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            {/* Search */}
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by employee name, code, leave type..."
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
            
            {/* Status Filter */}
            <Grid item xs={12} md={2}>
              <Autocomplete
                fullWidth
                size="small"
                options={statusOptions}
                value={statusOptions.find(opt => opt.value === filterStatus) || null}
                onChange={(event, newValue) => {
                  setFilterStatus(newValue?.value || "All");
                  setPage(0);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Status"
                    placeholder="Select status"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
              />
            </Grid>
            
            {/* Leave Type Filter */}
            <Grid item xs={12} md={2}>
              <Autocomplete
                fullWidth
                size="small"
                options={leaveTypeOptions}
                value={leaveTypeOptions.find(opt => opt.value === filterLeaveType) || null}
                onChange={(event, newValue) => {
                  setFilterLeaveType(newValue?.value || "All");
                  setPage(0);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Leave Type"
                    placeholder="Select type"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.label}
                  </li>
                )}
              />
            </Grid>
            
            {/* Date Range */}
            <Grid item xs={12} md={2}>
              <DatePicker
                label="From Date"
                value={startDate}
                onChange={setStartDate}
                slotProps={{ 
                  textField: { 
                    size: 'small', 
                    fullWidth: true 
                  } 
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <DatePicker
                label="To Date"
                value={endDate}
                onChange={setEndDate}
                slotProps={{ 
                  textField: { 
                    size: 'small', 
                    fullWidth: true 
                  } 
                }}
              />
            </Grid>
          </Grid>
          
          {/* Quick Filter Buttons and Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<Today />}
                onClick={handleShowTodayLeaves}
                size="small"
              >
                Today
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<DateRange />}
                onClick={handleShowThisWeekLeaves}
                size="small"
              >
                This Week
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<CalendarMonth />}
                onClick={handleShowThisMonthLeaves}
                size="small"
              >
                This Month
              </Button>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={showOnlyPending}
                    onChange={(e) => setShowOnlyPending(e.target.checked)}
                    size="small"
                  />
                }
                label="Show Pending Only"
                sx={{ ml: 1 }}
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={handleClearFilters}
                size="small"
              >
                Clear Filters
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<FileDownload />}
                onClick={handleExportCSV}
                size="small"
                disabled={filteredData.length === 0}
              >
                Export CSV
              </Button>
            </Box>
          </Box>
          
          {/* Sort Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Typography variant="caption" color="text.secondary">Sort by:</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Button
                size="small"
                startIcon={<Sort />}
                endIcon={sortField === 'start_date' && (sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
                onClick={() => handleSort('start_date')}
                variant={sortField === 'start_date' ? 'contained' : 'outlined'}
                className={sortField === 'start_date' ? '!text-white' : ''}
                sx={{ borderRadius: 2 }}
              >
                Date
              </Button>
              
              <Button
                size="small"
                startIcon={<Person />}
                endIcon={sortField === 'employee_name' && (sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
                onClick={() => handleSort('employee_name')}
                variant={sortField === 'employee_name' ? 'contained' : 'outlined'}
                className={sortField==='employee_name' ? "!text-white" :''}
                sx={{ borderRadius: 2 }}
              >
                Employee
              </Button>
              
              <Button
                size="small"
                startIcon={<FilterAlt />}
                endIcon={sortField === 'status' && (sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
                onClick={() => handleSort('status')}
                variant={sortField === 'status' ? 'contained' : 'outlined'}
                className={sortField==='status' ? '!text-white' :''}
                sx={{ borderRadius: 2 }}
              >
                Status
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* Leave Balance Summary (if available) */}
        {/* {leaveBalance.length > 0 && (
          <Paper sx={{ p: 2, mb: 3, borderRadius: 2, bgcolor: 'info.50' }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'info.dark' }}>
              <Info sx={{ verticalAlign: 'middle', mr: 1, fontSize: 18 }} />
              Leave Balance Overview
            </Typography>
            <Grid container spacing={2}>
              {leaveBalance.slice(0, 2).map((balance, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {balance.employee_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {balance.employee_id}
                      </Typography>
                    </Box>
                    
                    <Stack spacing={0.5}>
                      {balance.leave_balances.map((lb, idx) => (
                        <Box key={idx} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="caption" sx={{ minWidth: 100 }}>
                            {lb.leave_type_name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1, ml: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={(lb.consumed / lb.total) * 100} 
                              sx={{ 
                                flexGrow: 1,
                                height: 6,
                                borderRadius: 1,
                                backgroundColor: 'grey.200',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: lb.balance > 0 ? 'success.main' : 'error.main'
                                }
                              }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 70, textAlign: 'right' }}>
                              {lb.consumed}/{lb.total}
                            </Typography>
                            <Chip 
                              label={`${lb.balance} left`} 
                              size="small" 
                              color={lb.balance > 0 ? "success" : "error"}
                              variant="outlined"
                              sx={{ height: 20, fontSize: '0.65rem' }}
                            />
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )} */}

        {/* Loading State */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Loading leave requests...
              </Typography>
            </Box>
          </Box>
        )}

        {/* Leave Requests Table */}
        {!loading && filteredData.length > 0 && (
          <>
            <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.50' }}>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.dark' }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.dark' }}>Leave Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.dark' }}>Duration</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.dark' }}>Dates</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'primary.dark' }}>Reason</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, color: 'primary.dark' }}>Status</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, color: 'primary.dark' }}>Applied On</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600, color: 'primary.dark' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  
                  <TableBody>
                    {paginatedData.map((leave) => {
                      const duration = calculateDuration(leave.start_date, leave.end_date);
                      const isPending = leave.status === 'Pending';
                      
                      return (
                        <TableRow 
                          key={leave.leave_id}
                          hover
                          sx={{ 
                            '&:hover': { backgroundColor: 'action.hover' },
                            ...(isPending && { 
                              backgroundColor: '#fff8e1',
                              '&:hover': { backgroundColor: '#fff3cd' }
                            }),
                            ...(leave.status === 'Approved' && { 
                              backgroundColor: '#e8f5e9',
                              '&:hover': { backgroundColor: '#d4edda' }
                            }),
                            ...(leave.status === 'Rejected' && { 
                              backgroundColor: '#fdeaea',
                              '&:hover': { backgroundColor: '#f8d7da' }
                            })
                          }}
                        >
                          {/* Employee */}
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar 
                                sx={{ 
                                  width: 36, 
                                  height: 36, 
                                  fontSize: 14, 
                                  bgcolor: getAvatarColor(leave.employee_name),
                                  color: 'white'
                                }}
                              >
                                {getAvatarInitials(leave.employee_name)}
                              </Avatar>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={600} sx={{ color: 'text.primary' }}>
                                  {leave.employee_name}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                  <Typography variant="caption" color="text.secondary">
                                    {leave.employee_code}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">•</Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {leave.designation}
                                  </Typography>
                                  {leave.department && leave.department !== 'N/A' && (
                                    <>
                                      <Typography variant="caption" color="text.secondary">•</Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {leave.department}
                                      </Typography>
                                    </>
                                  )}
                                </Box>
                              </Box>
                            </Box>
                          </TableCell>
                          
                          {/* Leave Type */}
                          <TableCell>
                            <Chip 
                              label={leave.leave_type} 
                              size="small" 
                              color="primary"
                              variant="outlined"
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          
                          {/* Duration */}
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTime fontSize="small" color="action" />
                              <Typography variant="body2" fontWeight={600} sx={{ color: 'primary.main' }}>
                                {duration} day{duration > 1 ? 's' : ''}
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          {/* Dates */}
                          <TableCell>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {formatDateWithDay(leave.start_date)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ArrowDownward sx={{ fontSize: 12 }} />
                                to {formatDateWithDay(leave.end_date)}
                              </Typography>
                            </Box>
                          </TableCell>
                          
                          {/* Reason */}
                          <TableCell>
                            <Tooltip title={leave.reason} arrow>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  maxWidth: 200,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  cursor: 'help'
                                }}
                              >
                                {leave.reason || 'No reason provided'}
                              </Typography>
                            </Tooltip>
                          </TableCell>
                          
                          {/* Status */}
                          <TableCell align="center">
                            {getStatusBadge(leave.status)}
                          </TableCell>
                          
                          {/* Applied On */}
                          <TableCell align="center">
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(leave.created_at)}
                            </Typography>
                          </TableCell>
                          
                          {/* Actions */}
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                              <Tooltip title="View Details">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setSelectedLeave(leave);
                                    setDetailDialogOpen(true);
                                    if (onViewDetails) onViewDetails(leave);
                                  }}
                                  disabled={actionLoading === leave.leave_id}
                                  color="info"
                                >
                                  <Visibility fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              
                              {isPending && (
                                <>
                                  <Tooltip title="Approve Leave">
                                    <IconButton
                                      size="small"
                                      color="success"
                                      onClick={() => {
                                        setSelectedLeave(leave);
                                        setApproveDialogOpen(true);
                                      }}
                                      disabled={actionLoading === leave.leave_id}
                                    >
                                      {actionLoading === leave.leave_id ? (
                                        <CircularProgress size={16} color="success" />
                                      ) : (
                                        <CheckCircle fontSize="small" />
                                      )}
                                    </IconButton>
                                  </Tooltip>
                                  
                                  <Tooltip title="Reject Leave">
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => {
                                        setSelectedLeave(leave);
                                        setRejectDialogOpen(true);
                                      }}
                                      disabled={actionLoading === leave.leave_id}
                                    >
                                      {actionLoading === leave.leave_id ? (
                                        <CircularProgress size={16} color="error" />
                                      ) : (
                                        <Cancel fontSize="small" />
                                      )}
                                    </IconButton>
                                  </Tooltip>
                                </>
                              )}
                              
                              <Tooltip title="Delete Leave">
                                <IconButton
                                  size="small"
                                  color="default"
                                  onClick={() => {
                                    setSelectedLeave(leave);
                                    setDeleteDialogOpen(true);
                                  }}
                                  disabled={actionLoading === leave.leave_id}
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              
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
                sx={{ borderTop: 1, borderColor: 'divider' }}
              />
            </Paper>
            
            {/* Summary Footer */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2, p: 1 }}>
              <Typography variant="caption" color="text.secondary">
                Showing {paginatedData.length} of {filteredData.length} leave requests
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip size="small" label={`Pending: ${statusCount.pending}`} color="warning" variant="outlined" />
                  <Chip size="small" label={`Approved: ${statusCount.approved}`} color="success" variant="outlined" />
                  <Chip size="small" label={`Rejected: ${statusCount.rejected}`} color="error" variant="outlined" />
                </Box>
                
                <Typography variant="caption" color="text.secondary">
                  Total Duration: {filteredData.reduce((sum, leave) => 
                    sum + calculateDuration(leave.start_date, leave.end_date), 0
                  )} days
                </Typography>
              </Box>
            </Box>
          </>
        )}

        {/* Empty State */}
        {!loading && filteredData.length === 0 && (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <EventBusy sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {leaves.length === 0 
                ? 'No leave requests found' 
                : 'No leave requests match your filters'}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {leaves.length === 0 
                ? 'Start by creating a new leave request' 
                : 'Try adjusting your search or filter criteria'}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onCreate}
              className="!text-white"
            >
              Create Leave Request
            </Button>
          </Paper>
        )}

        {/* Leave Details Dialog */}
        <Dialog 
          open={detailDialogOpen} 
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          {selectedLeave && (
            <>
              <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: getAvatarColor(selectedLeave.employee_name), color: 'white' }}>
                    {getAvatarInitials(selectedLeave.employee_name)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedLeave.employee_name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedLeave.employee_code} • {selectedLeave.designation}
                    </Typography>
                  </Box>
                </Box>
              </DialogTitle>
              
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Leave Details
                      </Typography>
                      {getStatusBadge(selectedLeave.status)}
                    </Box>
                    <Divider />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Leave Type
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {selectedLeave.leave_type}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Duration
                    </Typography>
                    <Typography variant="body1" fontWeight={600} color="primary.main">
                      {calculateDuration(selectedLeave.start_date, selectedLeave.end_date)} days
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Start Date
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatDateWithDay(selectedLeave.start_date)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      End Date
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formatDateWithDay(selectedLeave.end_date)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Applied On
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(selectedLeave.created_at)}
                    </Typography>
                  </Grid>
                  
                  {selectedLeave.approved_on && (
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {selectedLeave.status === 'Approved' ? 'Approved On' : 'Rejected On'}
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(selectedLeave.approved_on)}
                      </Typography>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Reason for Leave
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, mt: 0.5, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body1">
                        {selectedLeave.reason}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>
              
              <DialogActions sx={{ p: 3, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Approve Dialog */}
        <Dialog 
          open={approveDialogOpen} 
          onClose={() => setApproveDialogOpen(false)}
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle>Approve Leave Request</DialogTitle>
          <DialogContent>
            {selectedLeave && (
              <Box>
                <Typography gutterBottom>
                  Are you sure you want to approve the leave request for <strong>{selectedLeave.employee_name}</strong>?
                </Typography>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Leave Type: <strong>{selectedLeave.leave_type}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: <strong>{calculateDuration(selectedLeave.start_date, selectedLeave.end_date)} days</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dates: <strong>{formatDate(selectedLeave.start_date)} to {formatDate(selectedLeave.end_date)}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Reason: {selectedLeave.reason}
                  </Typography>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setApproveDialogOpen(false)}
              disabled={actionLoading === selectedLeave?.leave_id}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => selectedLeave && handleApprove(selectedLeave.leave_id)} 
              variant="contained" 
              className="!text-white"
              disabled={actionLoading === selectedLeave?.leave_id}
              startIcon={actionLoading === selectedLeave?.leave_id ? <CircularProgress size={16} color="inherit" /> : <CheckCircle />}
            >
              {actionLoading === selectedLeave?.leave_id ? 'Approving...' : 'Approve'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog 
          open={rejectDialogOpen} 
          onClose={() => setRejectDialogOpen(false)}
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle>Reject Leave Request</DialogTitle>
          <DialogContent>
            {selectedLeave && (
              <Box>
                <Typography gutterBottom>
                  Are you sure you want to reject the leave request for <strong>{selectedLeave.employee_name}</strong>?
                </Typography>
                <Alert severity="warning" sx={{ mt: 2 }}>
                  This action cannot be undone. The employee will be notified of the rejection.
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setRejectDialogOpen(false)}
              disabled={actionLoading === selectedLeave?.leave_id}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => selectedLeave && handleReject(selectedLeave.leave_id)} 
              variant="contained" 
              color="error"
              disabled={actionLoading === selectedLeave?.leave_id}
              startIcon={actionLoading === selectedLeave?.leave_id ? <CircularProgress size={16} color="inherit" /> : <Cancel />}
            >
              {actionLoading === selectedLeave?.leave_id ? 'Rejecting...' : 'Reject'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog 
          open={deleteDialogOpen} 
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle>Delete Leave Request</DialogTitle>
          <DialogContent>
            {selectedLeave && (
              <Box>
                <Typography gutterBottom>
                  Are you sure you want to delete the leave request for <strong>{selectedLeave.employee_name}</strong>?
                </Typography>
                <Alert severity="error" sx={{ mt: 2 }}>
                  This action cannot be undone. All data for this leave request will be permanently deleted.
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setDeleteDialogOpen(false)}
              disabled={actionLoading === selectedLeave?.leave_id}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => selectedLeave && handleDelete(selectedLeave.leave_id)} 
              variant="contained" 
              color="error"
              disabled={actionLoading === selectedLeave?.leave_id}
              startIcon={actionLoading === selectedLeave?.leave_id ? <CircularProgress size={16} color="inherit" /> : <Delete />}
            >
              {actionLoading === selectedLeave?.leave_id ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity} 
            sx={{ width: '100%' }}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
};

export default LeaveManagement;