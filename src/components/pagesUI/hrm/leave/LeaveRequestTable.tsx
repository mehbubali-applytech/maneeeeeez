"use client";

import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Checkbox,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Avatar,
  LinearProgress,
  Alert,
  Grid,
  Divider
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  Visibility,
  Download,
  Chat,
  CalendarMonth,
  Person,
  Business,
  AccessTime
} from "@mui/icons-material";
import { ILeaveRequest } from "./LeaveRequestsPanel";

interface LeaveRequestTableProps {
  requests: ILeaveRequest[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onViewDetails: (id: string) => void;
  selectedRequests?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  isReadOnly?: boolean;
}

const LeaveRequestTable: React.FC<LeaveRequestTableProps> = ({
  requests,
  onApprove,
  onReject,
  onViewDetails,
  selectedRequests = [],
  onSelectionChange,
  isReadOnly = false
}) => {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [viewDetailsDialogOpen, setViewDetailsDialogOpen] = useState(false);
  const [selectedRequestDetails, setSelectedRequestDetails] = useState<ILeaveRequest | null>(null);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    
    if (event.target.checked) {
      onSelectionChange(requests.map(r => r.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (!onSelectionChange) return;
    
    const selectedIndex = selectedRequests.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedRequests, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedRequests.slice(1));
    } else if (selectedIndex === selectedRequests.length - 1) {
      newSelected = newSelected.concat(selectedRequests.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedRequests.slice(0, selectedIndex),
        selectedRequests.slice(selectedIndex + 1)
      );
    }

    onSelectionChange(newSelected);
  };

  const handleRejectClick = (id: string) => {
    setSelectedRequestId(id);
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (selectedRequestId) {
      onReject(selectedRequestId, rejectReason);
      setRejectDialogOpen(false);
      setSelectedRequestId(null);
      setRejectReason("");
    }
  };

  const handleViewDetails = (request: ILeaveRequest) => {
    setSelectedRequestDetails(request);
    setViewDetailsDialogOpen(true);
  };

  const getStatusColor = (status: ILeaveRequest['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getDaysUntilStart = (startDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: 'Started', color: 'default' };
    if (diffDays === 0) return { text: 'Today', color: 'error' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'warning' };
    if (diffDays <= 7) return { text: `${diffDays} days`, color: 'info' };
    return { text: `${diffDays} days`, color: 'success' };
  };

  if (requests.length === 0) {
    return (
      <Alert severity="info">
        <Typography>No leave requests found.</Typography>
      </Alert>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              {onSelectionChange && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedRequests.length > 0 &&
                      selectedRequests.length < requests.length
                    }
                    checked={
                      requests.length > 0 &&
                      selectedRequests.length === requests.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              <TableCell>Employee</TableCell>
              <TableCell>Leave Details</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Workflow</TableCell>
              <TableCell>Balance</TableCell>
              {!isReadOnly && <TableCell align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          
          <TableBody>
            {requests.map((request) => {
              const daysInfo = getDaysUntilStart(request.startDate);
              
              return (
                <TableRow key={request.id} hover>
                  {onSelectionChange && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRequests.indexOf(request.id) !== -1}
                        onChange={() => handleSelectOne(request.id)}
                      />
                    </TableCell>
                  )}
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {request.employeeAvatar ? (
                        <Avatar src={request.employeeAvatar} />
                      ) : (
                        <Avatar>{request.employeeName.charAt(0)}</Avatar>
                      )}
                      <Box>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {request.employeeName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" display="block">
                          {request.designation}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.department}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip
                          label={request.leaveTypeCode}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {request.leaveType}
                        </Typography>
                        {request.isHalfDay && (
                          <Chip
                            label={`Half Day (${request.halfDayType})`}
                            size="small"
                            color="info"
                          />
                        )}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {request.reason}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Applied: {formatDate(request.appliedDate)}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <AccessTime fontSize="small" color="action" />
                        <Typography variant="body2">
                          {request.totalDays} day{request.totalDays !== 1 ? 's' : ''}
                        </Typography>
                        <Chip
                          label={daysInfo.text}
                          size="small"
                          color={daysInfo.color as any}
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      label={request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      size="small"
                      color={getStatusColor(request.status) as any}
                      icon={request.status === 'pending' ? <AccessTime /> : undefined}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ width: 100 }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Stage {request.workflowStage} of {request.totalStages}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(request.workflowStage / request.totalStages) * 100}
                        sx={{ mt: 0.5 }}
                      />
                      {request.currentApprover && (
                        <Typography variant="caption" color="text.secondary">
                          Waiting: {request.currentApprover}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="body2" color={request.leaveBalance > 0 ? 'success.main' : 'error.main'}>
                        {request.leaveBalance} days
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Available
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  {!isReadOnly && (
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="View Details">
                          <IconButton
                            size="small"
                            onClick={() => handleViewDetails(request)}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        
                        {request.status === 'pending' && (
                          <>
                            <Tooltip title="Approve">
                              <IconButton
                                size="small"
                                color="success"
                                onClick={() => onApprove(request.id)}
                              >
                                <CheckCircle fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            
                            <Tooltip title="Reject">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleRejectClick(request.id)}
                              >
                                <Cancel fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        
                        {request.attachments && request.attachments.length > 0 && (
                          <Tooltip title="Download Attachments">
                            <IconButton size="small">
                              <Download fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Leave Request</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Please provide a reason for rejecting this leave request:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason..."
            required
          />
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="caption">
              This action cannot be undone. The employee will be notified of the rejection.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleRejectConfirm} 
            variant="contained" 
            color="error"
            disabled={!rejectReason.trim()}
            className="!text-white"
          >
            Reject Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog 
        open={viewDetailsDialogOpen} 
        onClose={() => setViewDetailsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRequestDetails && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Leave Request Details</Typography>
                <Chip
                  label={selectedRequestDetails.status.toUpperCase()}
                  color={getStatusColor(selectedRequestDetails.status) as any}
                />
              </Box>
            </DialogTitle>
            
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Employee Information
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                          {selectedRequestDetails.employeeAvatar ? (
                            <Avatar src={selectedRequestDetails.employeeAvatar} sx={{ width: 60, height: 60 }} />
                          ) : (
                            <Avatar sx={{ width: 60, height: 60 }}>
                              {selectedRequestDetails.employeeName.charAt(0)}
                            </Avatar>
                          )}
                          <Box>
                            <Typography variant="h6">{selectedRequestDetails.employeeName}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedRequestDetails.designation}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedRequestDetails.department} • ID: {selectedRequestDetails.employeeId}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Contact Information
                        </Typography>
                        {selectedRequestDetails.contactDuringLeave && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Contact during leave:</strong> {selectedRequestDetails.contactDuringLeave}
                          </Typography>
                        )}
                        {selectedRequestDetails.emergencyContact && (
                          <Typography variant="body2">
                            <strong>Emergency contact:</strong> {selectedRequestDetails.emergencyContact}
                          </Typography>
                        )}
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Leave Details
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip
                              label={selectedRequestDetails.leaveTypeCode}
                              color="primary"
                              variant="outlined"
                            />
                            <Typography variant="body1" fontWeight={600}>
                              {selectedRequestDetails.leaveType}
                            </Typography>
                          </Box>
                          
                          <Typography variant="body2">
                            <strong>Duration:</strong> {formatDate(selectedRequestDetails.startDate)} to {formatDate(selectedRequestDetails.endDate)}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Total Days:</strong> {selectedRequestDetails.totalDays}
                          </Typography>
                          {selectedRequestDetails.isHalfDay && (
                            <Typography variant="body2">
                              <strong>Half Day:</strong> {selectedRequestDetails.halfDayType === 'first' ? 'First Half' : 'Second Half'}
                            </Typography>
                          )}
                          <Typography variant="body2">
                            <strong>Applied On:</strong> {formatDate(selectedRequestDetails.appliedDate)}
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Leave Balance
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ 
                            width: 80, 
                            height: 80, 
                            borderRadius: '50%', 
                            border: '3px solid', 
                            borderColor: selectedRequestDetails.leaveBalance > 0 ? 'success.main' : 'error.main',
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 1
                          }}>
                            <Typography variant="h5" color={selectedRequestDetails.leaveBalance > 0 ? 'success.main' : 'error.main'}>
                              {selectedRequestDetails.leaveBalance}
                            </Typography>
                          </Box>
                          <Typography variant="body2" textAlign="center">
                            Days Available
                          </Typography>
                        </Box>
                      </Grid>
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Reason for Leave
                        </Typography>
                        <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                          <Typography variant="body2">
                            {selectedRequestDetails.reason}
                          </Typography>
                        </Paper>
                      </Grid>
                      
                      {selectedRequestDetails.attachments && selectedRequestDetails.attachments.length > 0 && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Supporting Documents
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                            {selectedRequestDetails.attachments.map((doc, idx) => (
                              <Chip
                                key={idx}
                                label={doc.name}
                                onClick={() => window.open(doc.url, '_blank')}
                                icon={<Download />}
                                variant="outlined"
                                sx={{ cursor: 'pointer' }}
                              />
                            ))}
                          </Box>
                        </Grid>
                      )}
                      
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Workflow Status
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={(selectedRequestDetails.workflowStage / selectedRequestDetails.totalStages) * 100}
                            sx={{ mb: 1 }}
                          />
                          <Typography variant="body2">
                            <strong>Current Stage:</strong> {selectedRequestDetails.workflowStage} of {selectedRequestDetails.totalStages}
                          </Typography>
                          {selectedRequestDetails.currentApprover && (
                            <Typography variant="body2">
                              <strong>Waiting for:</strong> {selectedRequestDetails.currentApprover}
                            </Typography>
                          )}
                          {selectedRequestDetails.previousApprovers.length > 0 && (
                            <Typography variant="body2">
                              <strong>Approved by:</strong> {selectedRequestDetails.previousApprovers.join(', ')}
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                      
                      {selectedRequestDetails.approverNotes && (
                        <Grid item xs={12}>
                          <Alert severity={selectedRequestDetails.status === 'rejected' ? 'error' : 'info'}>
                            <Typography variant="subtitle2">
                              {selectedRequestDetails.status === 'rejected' ? 'Rejection Reason:' : 'Approver Notes:'}
                            </Typography>
                            <Typography variant="body2">
                              {selectedRequestDetails.approverNotes}
                            </Typography>
                          </Alert>
                        </Grid>
                      )}
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </DialogContent>
            
            <DialogActions>
              <Button onClick={() => setViewDetailsDialogOpen(false)}>Close</Button>
              {selectedRequestDetails.status === 'pending' && (
                <>
                  <Button 
                    onClick={() => {
                      onApprove(selectedRequestDetails.id);
                      setViewDetailsDialogOpen(false);
                    }}
                    variant="contained" 
                    color="success"
                    startIcon={<CheckCircle />}
                    className="!text-white"
                  >
                    Approve
                  </Button>
                  <Button 
                    onClick={() => {
                      handleRejectClick(selectedRequestDetails.id);
                      setViewDetailsDialogOpen(false);
                    }}
                    variant="contained" 
                    color="error"
                    startIcon={<Cancel />}
                    className="!text-white"
                  >
                    Reject
                  </Button>
                </>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default LeaveRequestTable;