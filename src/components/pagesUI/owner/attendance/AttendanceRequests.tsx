"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Divider,
  Card,
  CardContent,
  Autocomplete,
  CircularProgress,
  Snackbar
} from "@mui/material";
import {
  Search,
  FilterList,
  CheckCircle,
  Cancel,
  Pending,
  Visibility,
  History,
  Person,
  Schedule,
  AccessTime,
  CalendarMonth,
  Download,
  Refresh,
  ArrowUpward,
  ArrowDownward
} from "@mui/icons-material";
import { ICorrectedAttendance, ICorrectionActionPayload } from "./AttendanceTypes";
import { 
  getCorrectedAttendance, 
  approveAbsentCorrection 
} from "./attendanceApi";

interface AttendanceRequestsProps {
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onViewDetails?: (request: ICorrectedAttendance) => void;
  onExport?: (data: ICorrectedAttendance[]) => void;
}

const AttendanceRequests: React.FC<AttendanceRequestsProps> = ({
  onApprove,
  onReject,
  onViewDetails,
  onExport
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [requests, setRequests] = useState<ICorrectedAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null); // Track which request is being processed
  const [selectedRequest, setSelectedRequest] = useState<ICorrectedAttendance | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Fetch corrected attendance data
  useEffect(() => {
    fetchCorrectedAttendance();
  }, [approving, rejecting]);

  const fetchCorrectedAttendance = async () => {
    try {
      setLoading(true);
      const response = await getCorrectedAttendance(filterStatus !== "All" ? filterStatus : undefined);
      
      if (response && response.data) {
        // Transform and validate the API response
        const validatedRequests = transformAndValidateApiResponse(response.data);
        setRequests(validatedRequests);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching corrected attendance:', error);
      setSnackbar({
        open: true,
        message: 'Failed to load correction requests',
        severity: 'error'
      });
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to transform and validate API response
  const transformAndValidateApiResponse = (apiData: any[]): ICorrectedAttendance[] => {
    return apiData.map(item => ({
      corrected_attendance_id: item.corrected_attendance_id || 0,
      employee_id: item.employee_id || 0,
      employee_code: item.employee_code || item.Employee?.employee_code || 'N/A',
      first_name: item.first_name || item.Employee?.first_name || 'Unknown',
      last_name: item.last_name || item.Employee?.last_name || '',
      designation: item.designation || item.Employee?.designation || 'N/A',
      attendance_date: item.attendance_date || new Date().toISOString().split('T')[0],
      check_in: item.check_in || '--:--',
      check_out: item.check_out || '--:--',
      shift_id: item.shift_id || 0,
      location: item.location || 'Not specified',
      source: item.source || 'manual',
      reason: item.reason || 'No reason provided',
      status: item.status || 'Need Approval',
      approved_by: item.approved_by,
      approved_at: item.approved_at,
      actions: item.actions || {},
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.updated_at || new Date().toISOString()
    }));
  };

  // Status options for Autocomplete
  const statusOptions = useMemo(() => [
    { label: "All Status", value: "All" },
    { label: "Need Approval", value: "Need Approval" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" }
  ], []);

  const handleApprove = async (correctedAttendanceId: number) => {
    try {
      setActionLoading(correctedAttendanceId);
      const payload = {
        status: "Approved",
        approved_by: 1, // Replace with actual user ID from auth
        notes: "Approved by admin"
      };

      const response = await approveAbsentCorrection(correctedAttendanceId, payload);
      setApproving(true);
      // Handle API response
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: response.message || 'Correction request approved successfully',
          severity: 'success'
        });
        
        // Update the specific request in state
        setRequests(prev => prev.map(request => 
          request.corrected_attendance_id === correctedAttendanceId 
            ? { 
                ...request, 
                status: 'Approved',
                approved_by: payload.approved_by,
                approved_at: new Date().toISOString()
              }
            : request
        ));
        
        // Call parent callback if provided
        if (onApprove) {
          onApprove(correctedAttendanceId.toString());
        }
      } else {
        throw new Error(response?.errorMessage || 'Failed to approve request');
      }
    } catch (error: any) {
      console.error('Error approving correction:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to approve correction request',
        severity: 'error'
      });
    } finally {
      setActionLoading(null);
      setApproveDialogOpen(false);
    }
  };

  const handleReject = async (correctedAttendanceId: number) => {
    try {
      setActionLoading(correctedAttendanceId);
      const payload = {
        status: "Rejected",
        approved_by: 1, // Replace with actual user ID from auth
        notes: rejectReason || "Request rejected"
      };

      const response = await approveAbsentCorrection(correctedAttendanceId, payload);
      setRejecting(true);
      // Handle API response
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: response.message || 'Correction request rejected successfully',
          severity: 'success'
        });
        
        // Update the specific request in state
        setRequests(prev => prev.map(request => 
          request.corrected_attendance_id === correctedAttendanceId 
            ? { 
                ...request, 
                status: 'Rejected',
                approved_by: payload.approved_by,
                approved_at: new Date().toISOString()
              }
            : request
        ));
        
        // Call parent callback if provided
        if (onReject) {
          onReject(correctedAttendanceId.toString());
        }
      } else {
        throw new Error(response?.errorMessage || 'Failed to reject request');
      }
    } catch (error: any) {
      console.error('Error rejecting correction:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to reject correction request',
        severity: 'error'
      });
    } finally {
      setActionLoading(null);
      setRejectDialogOpen(false);
      setRejectReason("");
    }
  };

  const filteredData = useMemo(() => {
    let filtered = [...requests];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(request => {
        const fullName = `${request.first_name || ''} ${request.last_name || ''}`.toLowerCase();
        const employeeCode = request.employee_code?.toLowerCase() || '';
        const reason = request.reason?.toLowerCase() || '';
        
        return (
          fullName.includes(searchQuery.toLowerCase()) ||
          employeeCode.includes(searchQuery.toLowerCase()) ||
          reason.includes(searchQuery.toLowerCase())
        );
      });
    }
    
    // Filter by status
    if (filterStatus !== "All") {
      filtered = filtered.filter(request => request.status === filterStatus);
    }
    
    return filtered;
  }, [requests, searchQuery, filterStatus]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  // Get avatar initials safely
  const getAvatarInitials = (request: ICorrectedAttendance) => {
    if (request.first_name && request.first_name.trim()) {
      return request.first_name.charAt(0).toUpperCase();
    }
    if (request.employee_code && request.employee_code.trim()) {
      return request.employee_code.charAt(0).toUpperCase();
    }
    return '?';
  };

  // Get full name safely
  const getFullName = (request: ICorrectedAttendance) => {
    const firstName = request.first_name || '';
    const lastName = request.last_name || '';
    return `${firstName} ${lastName}`.trim() || 'Unknown Employee';
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Need Approval':
        return <Chip icon={<Pending />} label="Pending" color="warning" size="small" />;
      case 'Approved':
        return <Chip icon={<CheckCircle />} label="Approved" color="success" size="small" />;
      case 'Rejected':
        return <Chip icon={<Cancel />} label="Rejected" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const getStatusCount = () => {
    const pending = requests.filter(r => r.status === 'Need Approval').length;
    const approved = requests.filter(r => r.status === 'Approved').length;
    const rejected = requests.filter(r => r.status === 'Rejected').length;
    return { pending, approved, rejected, total: requests.length };
  };

  const statusCount = getStatusCount();

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

  const formatDateTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Auto-refresh data after status filter changes
  useEffect(() => {
    if (filterStatus !== "All") {
      const timer = setTimeout(() => {
        fetchCorrectedAttendance();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [filterStatus]);

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History /> Attendance Correction Requests
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={fetchCorrectedAttendance}
              disabled={loading}
              size="small"
            >
              Refresh
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => onExport?.(requests)}
              size="small"
              disabled={requests.length === 0}
            >
              Export
            </Button>
          </Box>
        </Box>
        
        {/* Summary Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6} sm={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{statusCount.total}</Typography>
                <Typography variant="caption" color="text.secondary">Total Requests</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderColor: 'warning.main', border: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="warning.main">{statusCount.pending}</Typography>
                <Typography variant="caption" color="text.secondary">Pending</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderColor: 'success.main', border: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">{statusCount.approved}</Typography>
                <Typography variant="caption" color="text.secondary">Approved</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Card sx={{ borderColor: 'error.main', border: 1 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="error.main">{statusCount.rejected}</Typography>
                <Typography variant="caption" color="text.secondary">Rejected</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by employee name, code, or reason..."
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
          
          <Grid item xs={12} md={4}>
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
                setSearchQuery("");
                setFilterStatus("All");
              }}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Requests Table */}
      {!loading && filteredData.length > 0 && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell>Employee</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell align="center">Check-In</TableCell>
                  <TableCell align="center">Check-Out</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Submitted</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              
              <TableBody>
                {paginatedData.map((request) => (
                  <TableRow 
                    key={request.corrected_attendance_id}
                    hover
                    sx={{ 
                      ...(request.status === 'Need Approval' && { bgcolor: '#ffd7a3' }),
                      ...(request.status === 'Rejected' && { bgcolor: 'error.lighter' })
                    }}
                  >
                    {/* Employee */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, fontSize: 14, bgcolor: 'primary.main' }}>
                          {getAvatarInitials(request)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>
                            {getFullName(request)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {request.employee_code} • {request.designation}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    {/* Date */}
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(request.attendance_date)}
                      </Typography>
                    </TableCell>
                    
                    {/* Check-In */}
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {request.check_in}
                      </Typography>
                    </TableCell>
                    
                    {/* Check-Out */}
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600}>
                        {request.check_out}
                      </Typography>
                    </TableCell>
                    
                    {/* Reason */}
                    <TableCell>
                      <Tooltip title={request.reason}>
                        <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                          {request.reason && request.reason.length > 50 
                            ? `${request.reason.substring(0, 50)}...` 
                            : request.reason || 'No reason provided'}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    
                    {/* Status */}
                    <TableCell align="center">
                      {getStatusBadge(request.status)}
                    </TableCell>
                    
                    {/* Submitted */}
                    <TableCell align="center">
                      <Typography variant="caption">
                        {formatDateTime(request.created_at)}
                      </Typography>
                    </TableCell>
                    
                    {/* Actions */}
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedRequest(request);
                              setDetailDialogOpen(true);
                              if (onViewDetails) {
                                onViewDetails(request);
                              }
                            }}
                            disabled={actionLoading === request.corrected_attendance_id}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {request.status === 'Need Approval' && (
                          <>
                            <Tooltip title="Approve Request">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setApproveDialogOpen(true);
                                }}
                                disabled={actionLoading === request.corrected_attendance_id}
                              >
                                {actionLoading === request.corrected_attendance_id ? (
                                  <CircularProgress size={20} color="success" />
                                ) : (
                                  <CheckCircle fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Reject Request">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setRejectDialogOpen(true);
                                }}
                                disabled={actionLoading === request.corrected_attendance_id}
                              >
                                {actionLoading === request.corrected_attendance_id ? (
                                  <CircularProgress size={20} color="error" />
                                ) : (
                                  <Cancel fontSize="small" />
                                )}
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
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
        </>
      )}

      {/* Empty State */}
      {!loading && filteredData.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography>
            {requests.length === 0 
              ? 'No correction requests found.' 
              : 'No correction requests found for the selected filters.'}
          </Typography>
        </Alert>
      )}

      {/* Request Details Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              Correction Request Details
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                      {getAvatarInitials(selectedRequest)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {getFullName(selectedRequest)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedRequest.employee_code} • {selectedRequest.designation}
                      </Typography>
                    </Box>
                    <Box sx={{ ml: 'auto' }}>
                      {getStatusBadge(selectedRequest.status)}
                    </Box>
                  </Box>
                  <Divider />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Date</Typography>
                  <Typography variant="body2">
                    {formatDate(selectedRequest.attendance_date)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Submitted</Typography>
                  <Typography variant="body2">
                    {formatDateTime(selectedRequest.created_at)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      Requested Times
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption">Check-In</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedRequest.check_in}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption">Check-Out</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedRequest.check_out}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      Source & Location
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption">Source</Typography>
                        <Typography variant="body2">
                          {selectedRequest.source}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption">Location</Typography>
                        <Typography variant="body2">
                          {selectedRequest.location || 'Not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Reason for Correction</Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2">
                      {selectedRequest.reason || 'No reason provided'}
                    </Typography>
                  </Paper>
                </Grid>
                
                {selectedRequest.approved_by && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>Review Details</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption">Approved By</Typography>
                      <Typography variant="body2">
                        User ID: {selectedRequest.approved_by}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption">Approved At</Typography>
                      <Typography variant="body2">
                        {selectedRequest.approved_at ? formatDateTime(selectedRequest.approved_at) : 'N/A'}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
        <DialogTitle>Approve Correction Request</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box>
              <Typography gutterBottom>
                Are you sure you want to approve the correction request for {getFullName(selectedRequest)}?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {formatDate(selectedRequest.attendance_date)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Time: {selectedRequest.check_in} - {selectedRequest.check_out}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Reason: {selectedRequest.reason}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setApproveDialogOpen(false)}
            disabled={actionLoading === selectedRequest?.corrected_attendance_id}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => selectedRequest && handleApprove(selectedRequest.corrected_attendance_id)} 
            variant="contained" 
            className="!text-white"
            disabled={actionLoading === selectedRequest?.corrected_attendance_id}
          >
            {actionLoading === selectedRequest?.corrected_attendance_id ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Approve'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Correction Request</DialogTitle>
        <DialogContent>
          {selectedRequest && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Typography>
                Are you sure you want to reject the correction request for {getFullName(selectedRequest)}?
              </Typography>
              
              <TextField
                label="Reason for rejection"
                multiline
                rows={3}
                fullWidth
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                disabled={actionLoading === selectedRequest.corrected_attendance_id}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setRejectDialogOpen(false)}
            disabled={actionLoading === selectedRequest?.corrected_attendance_id}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => selectedRequest && handleReject(selectedRequest.corrected_attendance_id)} 
            variant="contained" 
            color="error"
            disabled={!rejectReason.trim() || actionLoading === selectedRequest?.corrected_attendance_id}
          >
            {actionLoading === selectedRequest?.corrected_attendance_id ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Reject'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default AttendanceRequests;