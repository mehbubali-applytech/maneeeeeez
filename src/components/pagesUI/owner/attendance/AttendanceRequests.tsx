// AttendanceRequests.tsx
"use client";

import React, { useState, useMemo } from "react";
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
  Autocomplete
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
import { IAttendanceCorrectionRequest } from "./AttendanceTypes";

interface AttendanceRequestsProps {
  requests?: IAttendanceCorrectionRequest[];
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onViewDetails?: (request: IAttendanceCorrectionRequest) => void;
  onExport?: (data: IAttendanceCorrectionRequest[]) => void;
}

const AttendanceRequests: React.FC<AttendanceRequestsProps> = ({
  requests = [],
  onApprove,
  onReject,
  onViewDetails,
  onExport
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'date' | 'employee'>('date');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedRequest, setSelectedRequest] = useState<IAttendanceCorrectionRequest | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  // Mock data
  const mockRequests: IAttendanceCorrectionRequest[] = useMemo(() => [
    {
      id: "REQ001",
      attendanceId: "ATT001",
      employeeId: "EMP001",
      employeeName: "Rajesh Kumar",
      date: "2024-01-15",
      currentCheckIn: "09:45",
      currentCheckOut: "18:00",
      requestedCheckIn: "09:00",
      requestedCheckOut: "18:00",
      reason: "Forgot to check-in on time due to meeting",
      status: "Pending",
      submittedAt: "2024-01-15T10:30:00Z",
      supportingDocuments: ["meeting_invite.pdf"]
    },
    {
      id: "REQ002",
      attendanceId: "ATT002",
      employeeId: "EMP002",
      employeeName: "Priya Sharma",
      date: "2024-01-14",
      currentCheckIn: "14:30",
      currentCheckOut: "22:00",
      requestedCheckIn: "14:00",
      requestedCheckOut: "22:00",
      reason: "Late check-in due to client call",
      status: "Approved",
      submittedAt: "2024-01-14T15:00:00Z",
      reviewedBy: "HR001",
      reviewedAt: "2024-01-14T16:30:00Z",
      reviewNotes: "Approved with note to maintain punctuality"
    },
    {
      id: "REQ003",
      attendanceId: "ATT003",
      employeeId: "EMP003",
      employeeName: "Amit Patel",
      date: "2024-01-13",
      currentCheckIn: "09:00",
      currentCheckOut: "17:00",
      requestedCheckIn: "09:00",
      requestedCheckOut: "18:00",
      reason: "Forgot to check-out",
      status: "Rejected",
      submittedAt: "2024-01-13T18:30:00Z",
      reviewedBy: "HR001",
      reviewedAt: "2024-01-14T10:00:00Z",
      reviewNotes: "Rejected - no supporting evidence provided"
    },
    {
      id: "REQ004",
      attendanceId: "ATT004",
      employeeId: "EMP004",
      employeeName: "Sneha Reddy",
      date: "2024-01-12",
      currentCheckIn: undefined,
      currentCheckOut: undefined,
      requestedCheckIn: "09:30",
      requestedCheckOut: "18:30",
      reason: "System error - attendance not recorded",
      status: "Pending",
      submittedAt: "2024-01-12T19:00:00Z",
      supportingDocuments: ["error_screenshot.png", "system_log.txt"]
    }
  ], []);

  const data = requests.length > 0 ? requests : mockRequests;

  // Status options for Autocomplete
  const statusOptions = useMemo(() => [
    { label: "All Status", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" }
  ], []);

  // Sort options for Autocomplete
  const sortOptions = useMemo(() => [
    { label: "Date (Newest First)", value: { by: 'date', order: 'desc' } },
    { label: "Date (Oldest First)", value: { by: 'date', order: 'asc' } },
    { label: "Employee Name (A-Z)", value: { by: 'employee', order: 'asc' } },
    { label: "Employee Name (Z-A)", value: { by: 'employee', order: 'desc' } }
  ], []);

  // Get current sort selection for Autocomplete
  const currentSort = useMemo(() => {
    const option = sortOptions.find(opt => 
      opt.value.by === sortBy && opt.value.order === sortOrder
    );
    return option || sortOptions[0];
  }, [sortBy, sortOrder, sortOptions]);

  const filteredData = useMemo(() => {
    let filtered = [...data];
    
    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(request =>
        request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter by status
    if (filterStatus !== "All") {
      filtered = filtered.filter(request => request.status === filterStatus);
    }
    
    // Filter by department (mock implementation)
    if (filterDepartment !== "All") {
      filtered = filtered.filter(request => {
        // In real app, would filter by employee department
        return true;
      });
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
      } else {
        comparison = a.employeeName.localeCompare(b.employeeName);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  }, [data, searchQuery, filterStatus, filterDepartment, sortBy, sortOrder]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Pending':
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
    const pending = data.filter(r => r.status === 'Pending').length;
    const approved = data.filter(r => r.status === 'Approved').length;
    const rejected = data.filter(r => r.status === 'Rejected').length;
    return { pending, approved, rejected, total: data.length };
  };

  const statusCount = getStatusCount();

  const handleApprove = (requestId: string) => {
    setApproveDialogOpen(false);
    if (onApprove) {
      onApprove(requestId);
    } else {
      console.log(`Approved request ${requestId}`);
      alert(`Request ${requestId} approved`);
    }
  };

  const handleReject = (requestId: string) => {
    setRejectDialogOpen(false);
    setRejectReason("");
    if (onReject) {
      onReject(requestId);
    } else {
      console.log(`Rejected request ${requestId} with reason: ${rejectReason}`);
      alert(`Request ${requestId} rejected`);
    }
  };

  const handleViewDetails = (request: IAttendanceCorrectionRequest) => {
    setSelectedRequest(request);
    setDetailDialogOpen(true);
    if (onViewDetails) {
      onViewDetails(request);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <History /> Attendance Correction Requests
          </Typography>
          
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={() => onExport?.(data)}
            size="small"
          >
            Export
          </Button>
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
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by employee or reason..."
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
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Autocomplete
              fullWidth
              size="small"
              options={sortOptions}
              value={currentSort}
              onChange={(event, newValue) => {
                if (newValue) {
                  setSortBy(newValue.value.by as 'date' | 'employee');
                  setSortOrder(newValue.value.order as 'asc' | 'desc');
                } else {
                  setSortBy('date');
                  setSortOrder('desc');
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Sort By"
                  placeholder="Select sort order"
                 
                />
              )}
              renderOption={(props, option) => (
                <li 
                  {...props} 
                  key={`${option.value.by}-${option.value.order}`}
                >
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
                setFilterDepartment("All");
              }}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Requests Table */}
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
              <TableCell>Employee</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="center">Current Time</TableCell>
              <TableCell align="center">Requested Time</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Submitted</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {paginatedData.map((request) => (
              <TableRow 
                key={request.id}
                hover
                sx={{ 
                  ...(request.status === 'Pending' && { bgcolor: '#ffd7a3' }),
                  ...(request.status === 'Rejected' && { bgcolor: 'error.lighter' })
                }}
              >
                {/* Employee */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                      {request.employeeName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {request.employeeName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {request.employeeId}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                {/* Date */}
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(request.date)}
                  </Typography>
                </TableCell>
                
                {/* Current Time */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {request.currentCheckIn ? (
                      <Typography variant="body2" color="text.secondary">
                        In: {request.currentCheckIn}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="error">
                        No check-in
                      </Typography>
                    )}
                    {request.currentCheckOut ? (
                      <Typography variant="body2" color="text.secondary">
                        Out: {request.currentCheckOut}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="error">
                        No check-out
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                
                {/* Requested Time */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {request.requestedCheckIn ? (
                      <Typography variant="body2" fontWeight={600}>
                        In: {request.requestedCheckIn}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        —
                      </Typography>
                    )}
                    {request.requestedCheckOut ? (
                      <Typography variant="body2" fontWeight={600}>
                        Out: {request.requestedCheckOut}
                      </Typography>
                    ) : (
                      <Typography variant="caption" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                
                {/* Reason */}
                <TableCell>
                  <Tooltip title={request.reason}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {request.reason.length > 50 ? `${request.reason.substring(0, 50)}...` : request.reason}
                    </Typography>
                  </Tooltip>
                  {request.supportingDocuments && request.supportingDocuments.length > 0 && (
                    <Typography variant="caption" color="primary">
                      {request.supportingDocuments.length} document(s)
                    </Typography>
                  )}
                </TableCell>
                
                {/* Status */}
                <TableCell align="center">
                  {getStatusBadge(request.status)}
                </TableCell>
                
                {/* Submitted */}
                <TableCell align="center">
                  <Typography variant="caption">
                    {formatDateTime(request.submittedAt)}
                  </Typography>
                </TableCell>
                
                {/* Actions */}
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(request)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    {request.status === 'Pending' && (
                      <>
                        <Tooltip title="Approve Request">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => {
                              setSelectedRequest(request);
                              setApproveDialogOpen(true);
                            }}
                          >
                            <CheckCircle fontSize="small" />
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
                          >
                            <Cancel fontSize="small" />
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

      {/* Empty State */}
      {filteredData.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography>
            No correction requests found for the selected filters.
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
                    <Avatar sx={{ width: 56, height: 56 }}>
                      {selectedRequest.employeeName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{selectedRequest.employeeName}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedRequest.employeeId}
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
                    {formatDate(selectedRequest.date)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Submitted</Typography>
                  <Typography variant="body2">
                    {formatDateTime(selectedRequest.submittedAt)}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom color="text.secondary">
                      Current Attendance
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption">Check-In</Typography>
                        <Typography variant="body2">
                          {selectedRequest.currentCheckIn || 'Not recorded'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption">Check-Out</Typography>
                        <Typography variant="body2">
                          {selectedRequest.currentCheckOut || 'Not recorded'}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ p: 2, borderColor: 'primary.main' }}>
                    <Typography variant="subtitle2" gutterBottom color="primary">
                      Requested Changes
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption">Check-In</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedRequest.requestedCheckIn || 'No change'}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption">Check-Out</Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {selectedRequest.requestedCheckOut || 'No change'}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>Reason for Correction</Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="body2">
                      {selectedRequest.reason}
                    </Typography>
                  </Paper>
                </Grid>
                
                {selectedRequest.supportingDocuments && selectedRequest.supportingDocuments.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Supporting Documents</Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {selectedRequest.supportingDocuments.map((doc, index) => (
                        <Chip
                          key={index}
                          label={doc}
                          size="small"
                          onClick={() => window.open(`/documents/${doc}`, '_blank')}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
                
                {selectedRequest.reviewedBy && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>Review Details</Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption">Reviewed By</Typography>
                      <Typography variant="body2">
                        {selectedRequest.reviewedBy}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="caption">Reviewed At</Typography>
                      <Typography variant="body2">
                        {selectedRequest.reviewedAt ? formatDateTime(selectedRequest.reviewedAt) : 'N/A'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption">Review Notes</Typography>
                      <Typography variant="body2">
                        {selectedRequest.reviewNotes || 'No notes provided'}
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
                Are you sure you want to approve the correction request for {selectedRequest.employeeName}?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {formatDate(selectedRequest.date)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Request: {selectedRequest.currentCheckIn || 'None'} → {selectedRequest.requestedCheckIn}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => selectedRequest && handleApprove(selectedRequest.id)} 
            variant="contained" 
            className="!text-white"
          >
            Approve
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
                Are you sure you want to reject the correction request for {selectedRequest.employeeName}?
              </Typography>
              
              <TextField
                label="Reason for rejection"
                multiline
                rows={3}
                fullWidth
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => selectedRequest && handleReject(selectedRequest.id)} 
            variant="contained" 
            color="error"
            disabled={!rejectReason.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttendanceRequests;