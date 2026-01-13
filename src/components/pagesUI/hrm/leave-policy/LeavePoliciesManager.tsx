"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  TextField,
  Grid,
  Menu,
  MenuItem,
  Alert,
  Pagination,
  InputAdornment,
  Avatar,
  AvatarGroup
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  FilterList,
  Download,
  MoreVert,
  ContentCopy,
  Archive,
  Unarchive,
  People,
  CalendarMonth,
  Settings
} from "@mui/icons-material";
import { ILeavePolicy, ILeaveType } from "./LeavePolicyTypes";

interface LeavePoliciesManagerProps {
  policies: ILeavePolicy[];
  leaveTypes: ILeaveType[];
  onAddPolicy: () => void;
  onEditPolicy: (id: string) => void;
  onDeletePolicy: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

const LeavePoliciesManager: React.FC<LeavePoliciesManagerProps> = ({
  policies,
  leaveTypes,
  onAddPolicy,
  onEditPolicy,
  onDeletePolicy,
  onToggleActive
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuPolicy, setSelectedMenuPolicy] = useState<ILeavePolicy | null>(null);

  const filteredPolicies = policies.filter(policy => {
    // Search filter
    if (searchQuery && !policy.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !policy.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Active filter
    if (filterActive !== null && policy.active !== filterActive) {
      return false;
    }
    
    return true;
  });

  const paginatedPolicies = filteredPolicies.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const getLeaveTypeNames = (leaveTypeIds: string[]) => {
    return leaveTypes
      .filter(lt => leaveTypeIds.includes(lt.id))
      .map(lt => lt.name)
      .join(', ');
  };

  const getApplicableToText = (policy: ILeavePolicy) => {
    const parts = [];
    if (policy.applicableTo.employmentType.length > 0) {
      parts.push(policy.applicableTo.employmentType.join(', '));
    }
    if (policy.applicableTo.departments[0] !== 'All') {
      parts.push(`${policy.applicableTo.departments.length} depts`);
    }
    return parts.join(' • ');
  };

  const handleDeleteClick = (id: string) => {
    setPolicyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (policyToDelete) {
      onDeletePolicy(policyToDelete);
      setDeleteDialogOpen(false);
      setPolicyToDelete(null);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, policy: ILeavePolicy) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedMenuPolicy(policy);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedMenuPolicy(null);
  };

  const handleClonePolicy = () => {
    if (selectedMenuPolicy) {
      console.log("Clone policy:", selectedMenuPolicy);
    }
    handleMenuClose();
  };

  const isPolicyEffective = (policy: ILeavePolicy) => {
    const today = new Date();
    const effectiveFrom = new Date(policy.effectiveFrom);
    const effectiveTo = policy.effectiveTo ? new Date(policy.effectiveTo) : null;
    
    return today >= effectiveFrom && (!effectiveTo || today <= effectiveTo);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Manage Leave Policies
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => console.log("Export policies")}
              size="small"
            >
              Export
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={onAddPolicy}
              className="!text-white"
              size="small"
            >
              Create Policy
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search policies..."
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
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={filterActive === null ? "all" : filterActive ? "active" : "inactive"}
                onChange={(e) => {
                  if (e.target.value === "all") setFilterActive(null);
                  else setFilterActive(e.target.value === "active");
                }}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchQuery("");
                  setFilterActive(null);
                }}
                fullWidth
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Policies Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>Policy</TableCell>
              <TableCell>Applicable To</TableCell>
              <TableCell>Leave Types</TableCell>
              <TableCell align="center">Effective Period</TableCell>
              <TableCell align="center">Approval Levels</TableCell>
              <TableCell align="center">Priority</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {paginatedPolicies.map((policy) => (
              <TableRow key={policy.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {policy.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {policy.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Created by: {policy.createdBy}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <People fontSize="small" color="action" />
                    <Box>
                      <Typography variant="body2">
                        {getApplicableToText(policy)}
                      </Typography>
                      {policy.applicableTo.tenure.minMonths > 0 && (
                        <Typography variant="caption" color="text.secondary">
                          Min tenure: {policy.applicableTo.tenure.minMonths} months
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    {getLeaveTypeNames(policy.leaveTypes)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {policy.leaveTypes.length} leave type(s)
                  </Typography>
                </TableCell>
                
                <TableCell align="center">
                  <Box>
                    <Typography variant="body2">
                      From: {new Date(policy.effectiveFrom).toLocaleDateString()}
                    </Typography>
                    {policy.effectiveTo && (
                      <Typography variant="caption" color="text.secondary">
                        To: {new Date(policy.effectiveTo).toLocaleDateString()}
                      </Typography>
                    )}
                    {!isPolicyEffective(policy) && (
                      <Chip 
                        label="Not Effective" 
                        size="small" 
                        color="warning" 
                        sx={{ mt: 0.5 }}
                      />
                    )}
                  </Box>
                </TableCell>
                
                <TableCell align="center">
                  <Box>
                    <AvatarGroup max={3} sx={{ justifyContent: 'center' }}>
                      {policy.approvalMatrix.levels.map((level, index) => (
                        <Avatar 
                          key={index}
                          sx={{ width: 24, height: 24, fontSize: 12 }}
                        >
                          {level.approverRole.charAt(0)}
                        </Avatar>
                      ))}
                    </AvatarGroup>
                    <Typography variant="caption" color="text.secondary">
                      {policy.approvalMatrix.levels.length} level(s)
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell align="center">
                  <Chip 
                    label={`Priority ${policy.priority}`} 
                    size="small" 
                    color={policy.priority === 1 ? "error" : policy.priority === 2 ? "warning" : "info"}
                    variant="outlined"
                  />
                </TableCell>
                
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Switch
                      size="small"
                      checked={policy.active}
                      onChange={(e) => onToggleActive(policy.id, e.target.checked)}
                    />
                    <Chip
                      label={policy.active ? "Active" : "Inactive"}
                      size="small"
                      color={policy.active ? "success" : "default"}
                    />
                  </Box>
                </TableCell>
                
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => onEditPolicy(policy.id)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => onEditPolicy(policy.id)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="More Options">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, policy)}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {filteredPolicies.length > rowsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={Math.ceil(filteredPolicies.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Empty State */}
      {filteredPolicies.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography>
            No leave policies found. Create your first leave policy to get started.
          </Typography>
        </Alert>
      )}

      {/* Statistics */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{policies.length}</Typography>
              <Typography variant="caption" color="text.secondary">Total Policies</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                {policies.filter(p => p.active).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">Active</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">
                {policies.filter(p => isPolicyEffective(p)).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">Currently Effective</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">
                {policies.filter(p => p.priority === 1).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">Priority 1</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Leave Policy</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this leave policy? This action cannot be undone.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Deleting this policy will affect all employees assigned to it. Consider deactivating instead.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained" 
            color="error"
            className="!text-white"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {selectedMenuPolicy && (
          <>
            <MenuItem onClick={() => {
              onEditPolicy(selectedMenuPolicy.id);
              handleMenuClose();
            }}>
              <Edit fontSize="small" sx={{ mr: 1 }} />
              Edit Policy
            </MenuItem>
            
            <MenuItem onClick={handleClonePolicy}>
              <ContentCopy fontSize="small" sx={{ mr: 1 }} />
              Clone Policy
            </MenuItem>
            
            <MenuItem onClick={() => {
              onToggleActive(selectedMenuPolicy.id, !selectedMenuPolicy.active);
              handleMenuClose();
            }}>
              {selectedMenuPolicy.active ? (
                <>
                  <Archive fontSize="small" sx={{ mr: 1 }} />
                  Deactivate
                </>
              ) : (
                <>
                  <Unarchive fontSize="small" sx={{ mr: 1 }} />
                  Activate
                </>
              )}
            </MenuItem>
            
            <MenuItem onClick={() => {
              console.log("View policy assignments");
              handleMenuClose();
            }}>
              <People fontSize="small" sx={{ mr: 1 }} />
              View Assignments
            </MenuItem>
            
            <MenuItem onClick={() => {
              handleDeleteClick(selectedMenuPolicy.id);
              handleMenuClose();
            }} sx={{ color: 'error.main' }}>
              <Delete fontSize="small" sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};

export default LeavePoliciesManager;