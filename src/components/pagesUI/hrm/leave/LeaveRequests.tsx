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
  Checkbox,
  FormControlLabel,
  Autocomplete,
  Menu,
  MenuItem
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
  ArrowDownward,
  MoreVert,
  Upload,
  Send
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ILeaveRequest, LEAVE_TYPES, getLeaveTypeColor, getStatusColor } from "./LeaveTypes";

interface LeaveRequestsProps {
  requests?: ILeaveRequest[];
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string, reason: string) => void;
  onEscalate?: (requestId: string, toRole: string) => void;
  onViewDetails?: (request: ILeaveRequest) => void;
  onExport?: (data: ILeaveRequest[]) => void;
  onBulkAction?: (selectedIds: string[], action: string) => void;
}

const LeaveRequests: React.FC<LeaveRequestsProps> = ({
  requests = [],
  onApprove,
  onReject,
  onEscalate,
  onViewDetails,
  onExport,
  onBulkAction
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterLeaveType, setFilterLeaveType] = useState("All");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ILeaveRequest | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [escalateTo, setEscalateTo] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | "escalate">("approve");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const data = requests;

  const statusOptions = useMemo(() => [
    { label: "All Status", value: "All" },
    { label: "Pending", value: "Pending" },
    { label: "Approved", value: "Approved" },
    { label: "Rejected", value: "Rejected" },
    { label: "Escalated", value: "Escalated" }
  ], []);

  const departmentOptions = useMemo(() => [
    { label: "All Departments", value: "All" },
    { label: "Engineering", value: "Engineering" },
    { label: "Marketing", value: "Marketing" },
    { label: "Sales", value: "Sales" },
    { label: "HR", value: "HR" },
    { label: "Finance", value: "Finance" }
  ], []);

  const leaveTypeOptions = useMemo(() => [
    { label: "All Types", value: "All" },
    { label: "Annual Leave", value: "Annual" },
    { label: "Sick Leave", value: "Sick" },
    { label: "Casual Leave", value: "Casual" },
    { label: "Maternity Leave", value: "Maternity" },
    { label: "Paternity Leave", value: "Paternity" },
    { label: "Unpaid Leave", value: "Unpaid" }
  ], []);

  const escalateOptions = useMemo(() => [
    { label: "Department Head", value: "Department Head" },
    { label: "HR Director", value: "HR Director" },
    { label: "Management", value: "Management" },
    { label: "CEO", value: "CEO" }
  ], []);

  const filteredData = useMemo(() => {
    let filtered = [...data];
    
    if (searchQuery) {
      filtered = filtered.filter(request =>
        request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (filterStatus !== "All") {
      filtered = filtered.filter(request => request.status === filterStatus);
    }
    
    if (filterDepartment !== "All") {
      filtered = filtered.filter(request => request.department === filterDepartment);
    }
    
    if (filterLeaveType !== "All") {
      filtered = filtered.filter(request => request.leaveType === filterLeaveType);
    }
    
    if (startDate) {
      filtered = filtered.filter(request => new Date(request.startDate) >= startDate);
    }
    
    if (endDate) {
      filtered = filtered.filter(request => new Date(request.endDate) <= endDate);
    }
    
    return filtered;
  }, [data, searchQuery, filterStatus, filterDepartment, filterLeaveType, startDate, endDate]);

  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, page, rowsPerPage]);

  const getStatusBadge = (status: string) => {
    const color = getStatusColor(status);
    switch(status) {
      case 'Pending':
        return <Chip icon={<Pending />} label="Pending" color="warning" size="small" />;
      case 'Approved':
        return <Chip icon={<CheckCircle />} label="Approved" color="success" size="small" />;
      case 'Rejected':
        return <Chip icon={<Cancel />} label="Rejected" color="error" size="small" />;
      case 'Escalated':
        return <Chip label="Escalated" color="info" size="small" />;
      default:
        return <Chip label={status} color={color as any} size="small" />;
    }
  };

  const getLeaveTypeBadge = (type: string) => {
    const color = getLeaveTypeColor(type as any);
    const typeInfo = LEAVE_TYPES[type.toUpperCase() as keyof typeof LEAVE_TYPES];
    return (
      <Chip 
        label={typeInfo?.label || type} 
        color={color as any} 
        size="small" 
        variant="outlined"
      />
    );
  };

  const getStatusCount = () => {
    const pending = data.filter(r => r.status === 'Pending').length;
    const approved = data.filter(r => r.status === 'Approved').length;
    const rejected = data.filter(r => r.status === 'Rejected').length;
    const escalated = data.filter(r => r.status === 'Escalated').length;
    return { pending, approved, rejected, escalated, total: data.length };
  };

  const statusCount = getStatusCount();

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRequests(paginatedData.map(request => request.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests(prev =>
      prev.includes(requestId)
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const handleBulkAction = (action: string) => {
    if (selectedRequests.length === 0) {
      alert("Please select at least one request");
      return;
    }

    if (action === 'approve') {
      setActionType('approve');
      setActionDialogOpen(true);
    } else if (action === 'reject') {
      setActionType('reject');
      setRejectDialogOpen(true);
    } else if (action === 'escalate') {
      setActionType('escalate');
      setEscalateDialogOpen(true);
    }
  };

  const handleApprove = () => {
    if (selectedRequest) {
      setActionDialogOpen(false);
      onApprove?.(selectedRequest.id);
    } else if (selectedRequests.length > 0) {
      setActionDialogOpen(false);
      onBulkAction?.(selectedRequests, 'approve');
      setSelectedRequests([]);
    }
  };

  const handleReject = () => {
    if (selectedRequest) {
      setRejectDialogOpen(false);
      onReject?.(selectedRequest.id, rejectReason);
      setRejectReason("");
    } else if (selectedRequests.length > 0) {
      setRejectDialogOpen(false);
      onBulkAction?.(selectedRequests, 'reject');
      setSelectedRequests([]);
      setRejectReason("");
    }
  };

  const handleEscalate = () => {
    if (selectedRequest) {
      setEscalateDialogOpen(false);
      onEscalate?.(selectedRequest.id, escalateTo);
      setEscalateTo("");
    } else if (selectedRequests.length > 0) {
      setEscalateDialogOpen(false);
      onBulkAction?.(selectedRequests, 'escalate');
      setSelectedRequests([]);
      setEscalateTo("");
    }
  };

  const handleViewDetails = (request: ILeaveRequest) => {
    setSelectedRequest(request);
    setDetailDialogOpen(true);
    onViewDetails?.(request);
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Pending /> Leave Requests
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              {selectedRequests.length > 0 && (
                <>
                  <Button
                    variant="contained"
                    startIcon={<CheckCircle />}
                    onClick={() => handleBulkAction('approve')}
                    size="small"
                    color="success"
                    className="!text-white"
                  >
                    Approve ({selectedRequests.length})
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => handleBulkAction('reject')}
                    size="small"
                    color="error"
                  >
                    Reject ({selectedRequests.length})
                  </Button>
                </>
              )}
              
              <Button
                variant="outlined"
                startIcon={<Download />}
                onClick={() => onExport?.(data)}
                size="small"
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
            <Grid item xs={12} md={3}>
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
                  />
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
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
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
            
            <Grid item xs={12} md={3}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("All");
                  setFilterDepartment("All");
                  setFilterLeaveType("All");
                  setStartDate(null);
                  setEndDate(null);
                }}
                fullWidth
              >
                Clear Filters
              </Button>
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
          </Grid>
        </Paper>

        {/* Leave Requests Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRequests.length > 0 && selectedRequests.length < paginatedData.length}
                    checked={paginatedData.length > 0 && selectedRequests.length === paginatedData.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Employee</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell align="center">Days</TableCell>
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
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRequests.includes(request.id)}
                      onChange={() => handleSelectRequest(request.id)}
                    />
                  </TableCell>
                  
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
                          {request.department} • {request.role}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  {/* Leave Type */}
                  <TableCell>
                    {getLeaveTypeBadge(request.leaveType)}
                  </TableCell>
                  
                  {/* Dates */}
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {formatDate(request.startDate)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        to {formatDate(request.endDate)}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {/* Days */}
                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600}>
                      {request.totalDays}
                    </Typography>
                  </TableCell>
                  
                  {/* Reason */}
                  <TableCell>
                    <Tooltip title={request.reason}>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {request.reason.length > 50 ? `${request.reason.substring(0, 50)}...` : request.reason}
                      </Typography>
                    </Tooltip>
                    {request.attachments && request.attachments.length > 0 && (
                      <Typography variant="caption" color="primary">
                        {request.attachments.length} attachment(s)
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
                          <Tooltip title="Approve">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() => {
                                setSelectedRequest(request);
                                setActionType('approve');
                                setActionDialogOpen(true);
                              }}
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          
                          <Tooltip title="Reject">
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
                          
                          <Tooltip title="Escalate">
                            <IconButton
                              size="small"
                              color="info"
                              onClick={() => {
                                setSelectedRequest(request);
                                setEscalateDialogOpen(true);
                              }}
                            >
                              <Send fontSize="small" />
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
              No leave requests found for the selected filters.
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
                Leave Request Details
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
                          {selectedRequest.department} • {selectedRequest.role} ({selectedRequest.employeeId})
                        </Typography>
                      </Box>
                      <Box sx={{ ml: 'auto' }}>
                        {getStatusBadge(selectedRequest.status)}
                      </Box>
                    </Box>
                    <Divider />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Leave Type</Typography>
                    {getLeaveTypeBadge(selectedRequest.leaveType)}
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Duration</Typography>
                    <Typography variant="body2">
                      {selectedRequest.totalDays} day(s)
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Start Date</Typography>
                    <Typography variant="body2">
                      {formatDate(selectedRequest.startDate)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>End Date</Typography>
                    <Typography variant="body2">
                      {formatDate(selectedRequest.endDate)}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Reason</Typography>
                    <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="body2">
                        {selectedRequest.reason}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>Attachments</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedRequest.attachments.map((doc, index) => (
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
                  
                  {selectedRequest.emergencyContact && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>Emergency Contact</Typography>
                      <Typography variant="body2">
                        {selectedRequest.emergencyContact}
                      </Typography>
                    </Grid>
                  )}
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Submitted</Typography>
                    <Typography variant="body2">
                      {formatDateTime(selectedRequest.submittedAt)}
                    </Typography>
                  </Grid>
                  
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
                  
                  {selectedRequest.escalationTo && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom>Escalated To</Typography>
                      <Typography variant="body2" color="info.main">
                        {selectedRequest.escalationTo}
                      </Typography>
                    </Grid>
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
        <Dialog open={actionDialogOpen} onClose={() => setActionDialogOpen(false)}>
          <DialogTitle>Approve Leave Request</DialogTitle>
          <DialogContent>
            {selectedRequest ? (
              <Box>
                <Typography gutterBottom>
                  Are you sure you want to approve leave request for {selectedRequest.employeeName}?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Type: {selectedRequest.leaveType}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Dates: {formatDate(selectedRequest.startDate)} to {formatDate(selectedRequest.endDate)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Days: {selectedRequest.totalDays}
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography gutterBottom>
                  Are you sure you want to approve {selectedRequests.length} selected leave request(s)?
                </Typography>
                <Alert severity="info" sx={{ mt: 2 }}>
                  This action will approve all selected requests.
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setActionDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleApprove} 
              variant="contained" 
              color="success"
              className="!text-white"
            >
              Approve
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
          <DialogTitle>Reject Leave Request</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {selectedRequest ? (
                <Typography>
                  Are you sure you want to reject leave request for {selectedRequest.employeeName}?
                </Typography>
              ) : (
                <Typography>
                  Are you sure you want to reject {selectedRequests.length} selected leave request(s)?
                </Typography>
              )}
              
              <TextField
                label="Reason for rejection *"
                multiline
                rows={3}
                fullWidth
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                required
              />
              
              <Alert severity="warning">
                <Typography variant="caption">
                  Note: Rejection reasons are visible to employees.
                </Typography>
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleReject} 
              variant="contained" 
              color="error"
              disabled={!rejectReason.trim()}
            >
              Reject
            </Button>
          </DialogActions>
        </Dialog>

        {/* Escalate Dialog */}
        <Dialog open={escalateDialogOpen} onClose={() => setEscalateDialogOpen(false)}>
          <DialogTitle>Escalate Leave Request</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              {selectedRequest ? (
                <Typography>
                  Escalate leave request for {selectedRequest.employeeName} to:
                </Typography>
              ) : (
                <Typography>
                  Escalate {selectedRequests.length} selected leave request(s) to:
                </Typography>
              )}
              
              <Autocomplete
                fullWidth
                size="small"
                options={escalateOptions}
                value={escalateOptions.find(opt => opt.value === escalateTo) || null}
                onChange={(event, newValue) => {
                  setEscalateTo(newValue?.value || "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Escalate To *"
                    placeholder="Select approver"
                    required
                  />
                )}
              />
              
              <Alert severity="info">
                <Typography variant="caption">
                  Note: Escalated requests will be sent to the selected approver for review.
                </Typography>
              </Alert>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEscalateDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleEscalate} 
              variant="contained" 
              color="info"
              disabled={!escalateTo.trim()}
              className="!text-white"
            >
              Escalate
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default LeaveRequests;