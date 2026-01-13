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
  FormControlLabel,
  Menu,
  MenuItem,
  Alert,
  Pagination,
  InputAdornment
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
  Unarchive
} from "@mui/icons-material";
import { ILeaveType, LEAVE_CATEGORIES } from "./LeavePolicyTypes";
import LeaveTypeForm from "./LeaveTypeForm";

interface LeaveTypesManagerProps {
  leaveTypes: ILeaveType[];
  onAddLeaveType: () => void;
  onEditLeaveType: (id: string) => void;
  onDeleteLeaveType: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

const LeaveTypesManager: React.FC<LeaveTypesManagerProps> = ({
  leaveTypes,
  onAddLeaveType,
  onEditLeaveType,
  onDeleteLeaveType,
  onToggleActive
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveTypeToDelete, setLeaveTypeToDelete] = useState<string | null>(null);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<ILeaveType | null>(null);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuLeaveType, setSelectedMenuLeaveType] = useState<ILeaveType | null>(null);

  const filteredLeaveTypes = leaveTypes.filter(lt => {
    // Search filter
    if (searchQuery && !lt.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !lt.code.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filterCategory !== "All" && lt.category !== filterCategory) {
      return false;
    }
    
    // Active filter
    if (filterActive !== null && lt.active !== filterActive) {
      return false;
    }
    
    return true;
  });

  const paginatedLeaveTypes = filteredLeaveTypes.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const getCategoryColor = (category: string) => {
    const categoryObj = LEAVE_CATEGORIES.find(c => c.value === category);
    return categoryObj?.color || 'default';
  };

  const handleAddLeaveType = () => {
    setSelectedLeaveType(null);
    setMode('add');
    setFormDialogOpen(true);
  };

  const handleEditLeaveType = (leaveType: ILeaveType) => {
    setSelectedLeaveType(leaveType);
    setMode('edit');
    setFormDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setLeaveTypeToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (leaveTypeToDelete) {
      onDeleteLeaveType(leaveTypeToDelete);
      setDeleteDialogOpen(false);
      setLeaveTypeToDelete(null);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, leaveType: ILeaveType) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedMenuLeaveType(leaveType);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedMenuLeaveType(null);
  };

  const handleCloneLeaveType = () => {
    if (selectedMenuLeaveType) {
      const clonedLeaveType = {
        ...selectedMenuLeaveType,
        id: `LT${Math.floor(Math.random() * 1000)}`,
        name: `${selectedMenuLeaveType.name} (Copy)`,
        code: `${selectedMenuLeaveType.code}_COPY`,
        active: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      // You would typically add this to the list
      console.log("Cloned leave type:", clonedLeaveType);
    }
    handleMenuClose();
  };

  const handleArchiveLeaveType = () => {
    if (selectedMenuLeaveType) {
      onToggleActive(selectedMenuLeaveType.id, !selectedMenuLeaveType.active);
    }
    handleMenuClose();
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Manage Leave Types
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => console.log("Export leave types")}
              size="small"
            >
              Export
            </Button>
            
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddLeaveType}
              className="!text-white"
              size="small"
            >
              Add Leave Type
            </Button>
          </Box>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 2, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search leave types..."
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
              <TextField
                select
                fullWidth
                size="small"
                label="Category"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                SelectProps={{
                  native: true,
                }}
              >
                <option value="All">All Categories</option>
                {LEAVE_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </TextField>
            </Grid>
            
            <Grid item xs={12} md={3}>
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
                  setFilterCategory("All");
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

      {/* Leave Types Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>Leave Type</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="center">Annual Entitlement</TableCell>
              <TableCell align="center">Accrual</TableCell>
              <TableCell align="center">Carry Forward</TableCell>
              <TableCell align="center">Encashment</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {paginatedLeaveTypes.map((leaveType) => (
              <TableRow key={leaveType.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>
                      {leaveType.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Code: {leaveType.code}
                    </Typography>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {leaveType.description}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip
                    label={leaveType.category}
                    size="small"
                    color={getCategoryColor(leaveType.category) as any}
                    variant="outlined"
                  />
                </TableCell>
                
                <TableCell align="center">
                  <Typography variant="body2" fontWeight={600}>
                    {leaveType.annualEntitlement} days
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Max: {leaveType.maxContinuousDays} days
                  </Typography>
                </TableCell>
                
                <TableCell align="center">
                  <Typography variant="body2">
                    {leaveType.accrualMethod}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Min service: {leaveType.minServiceDays} days
                  </Typography>
                </TableCell>
                
                <TableCell align="center">
                  {leaveType.carryForward.allowed ? (
                    <Box>
                      <Typography variant="body2" color="success.main">
                        {leaveType.carryForward.maxDays} days
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Valid for {leaveType.carryForward.validity} months
                      </Typography>
                    </Box>
                  ) : (
                    <Chip label="Not Allowed" size="small" color="default" />
                  )}
                </TableCell>
                
                <TableCell align="center">
                  {leaveType.encashment.allowed ? (
                    <Box>
                      <Typography variant="body2" color="primary.main">
                        {leaveType.encashment.maxDays} days
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        @ {leaveType.encashment.rate}% rate
                      </Typography>
                    </Box>
                  ) : (
                    <Chip label="Not Allowed" size="small" color="default" />
                  )}
                </TableCell>
                
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                    <Switch
                      size="small"
                      checked={leaveType.active}
                      onChange={(e) => onToggleActive(leaveType.id, e.target.checked)}
                    />
                    <Chip
                      label={leaveType.active ? "Active" : "Inactive"}
                      size="small"
                      color={leaveType.active ? "success" : "default"}
                    />
                  </Box>
                </TableCell>
                
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    <Tooltip title="View Details">
                      <IconButton
                        size="small"
                        onClick={() => onEditLeaveType(leaveType.id)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditLeaveType(leaveType)}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="More Options">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, leaveType)}
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
      {filteredLeaveTypes.length > rowsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={Math.ceil(filteredLeaveTypes.length / rowsPerPage)}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {/* Empty State */}
      {filteredLeaveTypes.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography>
            No leave types found matching your criteria.
          </Typography>
        </Alert>
      )}

      {/* Statistics */}
      <Paper sx={{ p: 2, mt: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">{leaveTypes.length}</Typography>
              <Typography variant="caption" color="text.secondary">Total Types</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="success.main">
                {leaveTypes.filter(lt => lt.active).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">Active</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">
                {leaveTypes.filter(lt => lt.carryForward.allowed).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">Allow Carry Forward</Typography>
            </Box>
          </Grid>
          <Grid item xs={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6">
                {leaveTypes.filter(lt => lt.encashment.allowed).length}
              </Typography>
              <Typography variant="caption" color="text.secondary">Allow Encashment</Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Leave Type</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this leave type? This action cannot be undone.
          </Typography>
          <Alert severity="warning" sx={{ mt: 2 }}>
            Deleting this leave type will affect all existing policies and employee leave balances.
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

      {/* Leave Type Form Dialog */}
      <Dialog 
        open={formDialogOpen} 
        onClose={() => setFormDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <LeaveTypeForm
          leaveType={selectedLeaveType}
          mode={mode}
          onClose={() => setFormDialogOpen(false)}
          onSubmit={(data:any) => {
            console.log("Submit leave type:", data);
            setFormDialogOpen(false);
          }}
        />
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        {selectedMenuLeaveType && (
          <>
            <MenuItem onClick={() => {
              handleEditLeaveType(selectedMenuLeaveType);
              handleMenuClose();
            }}>
              <Edit fontSize="small" sx={{ mr: 1 }} />
              Edit Details
            </MenuItem>
            
            <MenuItem onClick={handleCloneLeaveType}>
              <ContentCopy fontSize="small" sx={{ mr: 1 }} />
              Clone Leave Type
            </MenuItem>
            
            <MenuItem onClick={handleArchiveLeaveType}>
              {selectedMenuLeaveType.active ? (
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
              handleDeleteClick(selectedMenuLeaveType.id);
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

export default LeaveTypesManager;