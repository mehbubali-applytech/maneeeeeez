"use client";

import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  IconButton,
  Alert
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  ClearAll,
  Send,
  Warning,
  Info
} from "@mui/icons-material";

interface BulkActionsPanelProps {
  selectedCount: number;
  onApprove: () => void;
  onReject: (reason: string) => void;
  onClearSelection: () => void;
}

const BulkActionsPanel: React.FC<BulkActionsPanelProps> = ({
  selectedCount,
  onApprove,
  onReject,
  onClearSelection
}) => {
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);

  const handleBulkReject = () => {
    if (rejectReason.trim()) {
      onReject(rejectReason);
      setRejectDialogOpen(false);
      setRejectReason("");
    }
  };

  const handleBulkApprove = () => {
    onApprove();
    setApproveDialogOpen(false);
  };

  return (
    <>
      <Paper sx={{ p: 2, mb: 3, bgcolor: 'info.50', borderColor: 'info.light', border: 1 }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={`${selectedCount} selected`} 
                color="primary" 
                icon={<Info />}
              />
              <Typography variant="body2" color="text.secondary">
                Select actions to perform on all selected requests
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                startIcon={<ClearAll />}
                onClick={onClearSelection}
                size="small"
              >
                Clear Selection
              </Button>
              
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => setApproveDialogOpen(true)}
                className="!text-white"
                size="small"
              >
                Approve All
              </Button>
              
              <Button
                variant="contained"
                color="error"
                startIcon={<Cancel />}
                onClick={() => setRejectDialogOpen(true)}
                className="!text-white"
                size="small"
              >
                Reject All
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Bulk Approve Confirmation Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)}>
        <DialogTitle>Approve Multiple Requests</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              You are about to approve <strong>{selectedCount} leave requests</strong>.
            </Typography>
          </Alert>
          <Typography variant="body2" paragraph>
            This action will approve all selected leave requests. Are you sure you want to continue?
          </Typography>
          <Alert severity="info">
            <Typography variant="caption">
              All affected employees will be notified automatically.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleBulkApprove} 
            variant="contained" 
            color="success"
            startIcon={<CheckCircle />}
            className="!text-white"
          >
            Approve All Requests
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
        <DialogTitle>Reject Multiple Requests</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2">
              You are about to reject <strong>{selectedCount} leave requests</strong>.
            </Typography>
          </Alert>
          
          <Typography variant="body2" paragraph>
            Please provide a reason for rejecting these requests:
          </Typography>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason for all selected requests..."
            required
            label="Rejection Reason"
          />
          
          <Alert severity="warning" sx={{ mt: 2 }}>
            <Typography variant="caption">
              This action cannot be undone. The same reason will be applied to all selected requests.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleBulkReject} 
            variant="contained" 
            color="error"
            disabled={!rejectReason.trim()}
            startIcon={<Cancel />}
            className="!text-white"
          >
            Reject All Requests
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BulkActionsPanel;