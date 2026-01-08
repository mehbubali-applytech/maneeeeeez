"use client";

import React, { useState, useMemo } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  Autocomplete,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Download,
  Search,
  ExpandMore,
  Settings,
  CheckCircle,
  Cancel
} from "@mui/icons-material";
import { ILeavePolicy } from "./LeaveTypes";

const LeavePolicies: React.FC = () => {
  const [policies, setPolicies] = useState<ILeavePolicy[]>([
    {
      id: "POL001",
      name: "Annual Leave Policy FY24",
      leaveType: "Annual",
      description: "Annual vacation leave for all permanent employees",
      eligibility: {
        minMonthsOfService: 3,
        eligibleRoles: ["All"],
        maxConsecutiveDays: 15
      },
      accrual: {
        method: "Monthly",
        daysPerPeriod: 1.25,
        maxAccumulation: 30
      },
      carryForward: {
        allowed: true,
        maxDays: 15,
        expiresAfterMonths: 6
      },
      encashment: {
        allowed: false,
        maxDays: 0
      },
      approvalWorkflow: ["Manager", "HR"],
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "HR001"
    },
    {
      id: "POL002",
      name: "Sick Leave Policy",
      leaveType: "Sick",
      description: "Medical and health related leaves",
      eligibility: {
        minMonthsOfService: 0,
        eligibleRoles: ["All"],
        maxConsecutiveDays: 7
      },
      accrual: {
        method: "Annual",
        daysPerPeriod: 10,
        maxAccumulation: 15
      },
      carryForward: {
        allowed: false,
        maxDays: 0
      },
      encashment: {
        allowed: false,
        maxDays: 0
      },
      approvalWorkflow: ["Manager"],
      isActive: true,
      createdAt: "2024-01-01T00:00:00Z",
      updatedAt: "2024-01-01T00:00:00Z",
      createdBy: "HR001"
    }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<ILeavePolicy | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form state
  const [formData, setFormData] = useState<Partial<ILeavePolicy>>({
    name: "",
    leaveType: "Annual",
    description: "",
    eligibility: {
      minMonthsOfService: 3,
      eligibleRoles: [],
      maxConsecutiveDays: 15
    },
    accrual: {
      method: "Monthly",
      daysPerPeriod: 1.25,
      maxAccumulation: 30
    },
    carryForward: {
      allowed: false,
      maxDays: 0
    },
    encashment: {
      allowed: false,
      maxDays: 0
    },
    approvalWorkflow: [],
    isActive: true
  });

  const leaveTypeOptions = [
    "Annual", "Sick", "Casual", "Maternity", "Paternity", "Unpaid", "Compensatory"
  ];

  const accrualMethods = ["Monthly", "Quarterly", "Annual", "Custom"];
  const roles = ["All", "Manager", "Executive", "Associate", "Trainee", "Intern"];

  const filteredPolicies = useMemo(() => {
    return policies.filter(policy =>
      policy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      policy.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [policies, searchQuery]);

  const handleAddPolicy = () => {
    setEditMode(false);
    setSelectedPolicy(null);
    setFormData({
      name: "",
      leaveType: "Annual",
      description: "",
      eligibility: {
        minMonthsOfService: 3,
        eligibleRoles: [],
        maxConsecutiveDays: 15
      },
      accrual: {
        method: "Monthly",
        daysPerPeriod: 1.25,
        maxAccumulation: 30
      },
      carryForward: {
        allowed: false,
        maxDays: 0
      },
      encashment: {
        allowed: false,
        maxDays: 0
      },
      approvalWorkflow: [],
      isActive: true
    });
    setDialogOpen(true);
  };

  const handleEditPolicy = (policy: ILeavePolicy) => {
    setEditMode(true);
    setSelectedPolicy(policy);
    setFormData(policy);
    setDialogOpen(true);
  };

  const handleDeletePolicy = (policyId: string) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      setPolicies(policies.filter(p => p.id !== policyId));
    }
  };

  const handleToggleActive = (policyId: string, isActive: boolean) => {
    setPolicies(policies.map(p => 
      p.id === policyId ? { ...p, isActive: !isActive } : p
    ));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.leaveType) {
      alert("Please fill in all required fields");
      return;
    }

    const newPolicy: ILeavePolicy = {
      id: editMode ? selectedPolicy!.id : `POL${(policies.length + 1).toString().padStart(3, '0')}`,
      name: formData.name!,
      leaveType: formData.leaveType! as any,
      description: formData.description!,
      eligibility: formData.eligibility!,
      accrual: formData.accrual!,
      carryForward: formData.carryForward!,
      encashment: formData.encashment!,
      approvalWorkflow: formData.approvalWorkflow!,
      isActive: formData.isActive!,
      createdAt: editMode ? selectedPolicy!.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: editMode ? selectedPolicy!.createdBy : "HR001"
    };

    if (editMode) {
      setPolicies(policies.map(p => p.id === selectedPolicy!.id ? newPolicy : p));
    } else {
      setPolicies([...policies, newPolicy]);
    }

    setDialogOpen(false);
  };

  const getLeaveTypeColor = (type: string) => {
    switch(type) {
      case 'Annual': return 'success';
      case 'Sick': return 'info';
      case 'Casual': return 'primary';
      case 'Maternity': return 'secondary';
      case 'Paternity': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Settings /> Leave Policies & Rules
          </Typography>
          
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddPolicy}
            className="!text-white"
          >
            Add New Policy
          </Button>
        </Box>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Configure leave types, accrual rules, eligibility, and approval workflows.
          </Typography>
        </Alert>
      </Box>

      {/* Search and Stats */}
      <Paper sx={{ p: 2, mb: 3 }}>
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
                  <Search sx={{ mr: 1, color: 'text.secondary' }} />
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">{policies.length}</Typography>
                <Typography variant="caption" color="text.secondary">Total Policies</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" color="success.main">
                  {policies.filter(p => p.isActive).length}
                </Typography>
                <Typography variant="caption" color="text.secondary">Active</Typography>
              </Box>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6">
                  {new Set(policies.map(p => p.leaveType)).size}
                </Typography>
                <Typography variant="caption" color="text.secondary">Leave Types</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Policies Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>Policy Name</TableCell>
              <TableCell>Leave Type</TableCell>
              <TableCell>Accrual Method</TableCell>
              <TableCell>Eligibility</TableCell>
              <TableCell>Carry Forward</TableCell>
              <TableCell>Approval Flow</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Last Updated</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          
          <TableBody>
            {filteredPolicies.map((policy) => (
              <TableRow key={policy.id} hover>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    {policy.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {policy.description.substring(0, 50)}...
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Chip 
                    label={policy.leaveType} 
                    color={getLeaveTypeColor(policy.leaveType) as any}
                    size="small"
                  />
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">{policy.accrual.method}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {policy.accrual.daysPerPeriod} days/{policy.accrual.method.toLowerCase()}
                  </Typography>
                </TableCell>
                
                <TableCell>
                  <Typography variant="body2">
                    Min {policy.eligibility.minMonthsOfService} months
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {policy.eligibility.eligibleRoles.includes("All") 
                      ? "All roles" 
                      : `${policy.eligibility.eligibleRoles.length} roles`
                    }
                  </Typography>
                </TableCell>
                
                <TableCell>
                  {policy.carryForward.allowed ? (
                    <Box>
                      <Typography variant="body2" color="success.main">
                        {policy.carryForward.maxDays} days
                      </Typography>
                      {policy.carryForward.expiresAfterMonths && (
                        <Typography variant="caption" color="text.secondary">
                          Expires in {policy.carryForward.expiresAfterMonths} months
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Not allowed
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {policy.approvalWorkflow.map((role, idx) => (
                      <Chip key={idx} label={role} size="small" variant="outlined" />
                    ))}
                  </Box>
                </TableCell>
                
                <TableCell align="center">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={policy.isActive}
                        onChange={() => handleToggleActive(policy.id, policy.isActive)}
                        size="small"
                      />
                    }
                    label={
                      <Chip
                        label={policy.isActive ? "Active" : "Inactive"}
                        size="small"
                        color={policy.isActive ? "success" : "default"}
                        variant="outlined"
                      />
                    }
                  />
                </TableCell>
                
                <TableCell align="center">
                  <Typography variant="caption">
                    {new Date(policy.updatedAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditPolicy(policy)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    
                    <IconButton
                      size="small"
                      onClick={() => handleDeletePolicy(policy.id)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Empty State */}
      {filteredPolicies.length === 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography>
            No policies found. Click {`"Add New Policy"`} to create one.
          </Typography>
        </Alert>
      )}

      {/* Policy Form Dialog */}
<Dialog 
  open={dialogOpen} 
  onClose={() => setDialogOpen(false)}
  maxWidth="md"
  fullWidth
  PaperProps={{
    sx: { maxHeight: '90vh' }
  }}
>
  <DialogTitle>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Settings />
      {editMode ? "Edit Leave Policy" : "Add New Leave Policy"}
    </Box>
  </DialogTitle>
  
  <DialogContent dividers>
    <Box sx={{ mt: 1 }}>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Basic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Policy Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={!formData.name}
            helperText={!formData.name ? "Policy name is required" : ""}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Autocomplete
            fullWidth
            options={leaveTypeOptions}
            value={formData.leaveType}
            onChange={(event, newValue) => {
              setFormData({ ...formData, leaveType: newValue as any });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Leave Type *"
                placeholder="Select leave type"
                error={!formData.leaveType}
                helperText={!formData.leaveType ? "Leave type is required" : ""}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Autocomplete
            fullWidth
            options={accrualMethods}
            value={formData.accrual?.method}
            onChange={(event, newValue) => {
              setFormData({
                ...formData,
                accrual: { ...formData.accrual!, method: newValue as any }
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Accrual Method *"
                placeholder="Select method"
                error={!formData.accrual?.method}
                helperText={!formData.accrual?.method ? "Accrual method is required" : ""}
              />
            )}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the purpose and scope of this policy..."
          />
        </Grid>
        
        {/* Eligibility Section */}
        <Grid item xs={12}>
          <Accordion defaultExpanded sx={{ mt: 2 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Eligibility Rules
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Minimum Months of Service *"
                    value={formData.eligibility?.minMonthsOfService}
                    onChange={(e) => setFormData({
                      ...formData,
                      eligibility: { 
                        ...formData.eligibility!, 
                        minMonthsOfService: parseInt(e.target.value) || 0
                      }
                    })}
                    inputProps={{ min: 0 }}
                    helperText="Employees must serve this long to be eligible"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Max Consecutive Days"
                    value={formData.eligibility?.maxConsecutiveDays}
                    onChange={(e) => setFormData({
                      ...formData,
                      eligibility: { 
                        ...formData.eligibility!, 
                        maxConsecutiveDays: parseInt(e.target.value) || undefined
                      }
                    })}
                    inputProps={{ min: 1 }}
                    helperText="Maximum continuous leave allowed (optional)"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    fullWidth
                    options={roles}
                    value={formData.eligibility?.eligibleRoles}
                    onChange={(event, newValue) => {
                      setFormData({
                        ...formData,
                        eligibility: { ...formData.eligibility!, eligibleRoles: newValue }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Eligible Roles"
                        placeholder="Select roles (leave empty for all)"
                        helperText="Select specific roles or leave empty to apply to all"
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Accrual Section */}
        <Grid item xs={12}>
          <Accordion sx={{ mt: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Accrual Rules
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Days per Period *"
                    value={formData.accrual?.daysPerPeriod}
                    onChange={(e) => setFormData({
                      ...formData,
                      accrual: { ...formData.accrual!, daysPerPeriod: parseFloat(e.target.value) || 0 }
                    })}
                    inputProps={{ step: "0.25", min: "0" }}
                    helperText={
                      formData.accrual?.method === "Monthly" 
                        ? "Days earned per month" 
                        : formData.accrual?.method === "Quarterly" 
                        ? "Days earned per quarter" 
                        : "Days earned per year"
                    }
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Accumulation"
                    value={formData.accrual?.maxAccumulation}
                    onChange={(e) => setFormData({
                      ...formData,
                      accrual: { ...formData.accrual!, maxAccumulation: parseFloat(e.target.value) || 0 }
                    })}
                    inputProps={{ min: "0" }}
                    helperText="Maximum days that can be accumulated"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Alert severity="info" sx={{ mt: 1 }}>
                    <Typography variant="caption">
                      Example: {formData.accrual?.daysPerPeriod || 0} days per {formData.accrual?.method?.toLowerCase() || "period"} with maximum accumulation of {formData.accrual?.maxAccumulation || 0} days
                    </Typography>
                  </Alert>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Carry Forward Section */}
        <Grid item xs={12}>
          <Accordion sx={{ mt: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Carry Forward Rules
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.carryForward?.allowed}
                        onChange={(e) => setFormData({
                          ...formData,
                          carryForward: { 
                            ...formData.carryForward!, 
                            allowed: e.target.checked 
                          }
                        })}
                      />
                    }
                    label="Allow employees to carry forward unused leave to next year"
                  />
                </Grid>
                
                {formData.carryForward?.allowed && (
                  <>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Maximum Days Carry Forward"
                        value={formData.carryForward?.maxDays}
                        onChange={(e) => setFormData({
                          ...formData,
                          carryForward: { 
                            ...formData.carryForward!, 
                            maxDays: parseInt(e.target.value) || 0
                          }
                        })}
                        inputProps={{ min: "0" }}
                        helperText="Maximum days that can be carried forward"
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Expires After (months)"
                        value={formData.carryForward?.expiresAfterMonths}
                        onChange={(e) => setFormData({
                          ...formData,
                          carryForward: { 
                            ...formData.carryForward!, 
                            expiresAfterMonths: parseInt(e.target.value) || undefined
                          }
                        })}
                        inputProps={{ min: "1", max: "12" }}
                        helperText="Carry forward expires after X months (optional)"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Alert severity="warning" sx={{ mt: 1 }}>
                        <Typography variant="caption">
                          Note: Carried forward leave typically expires if not used within the specified period
                        </Typography>
                      </Alert>
                    </Grid>
                  </>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Encashment Section */}
        <Grid item xs={12}>
          <Accordion sx={{ mt: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Encashment Rules
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.encashment?.allowed}
                        onChange={(e) => setFormData({
                          ...formData,
                          encashment: { 
                            ...formData.encashment!, 
                            allowed: e.target.checked 
                          }
                        })}
                      />
                    }
                    label="Allow employees to encash unused leave"
                  />
                </Grid>
                
                {formData.encashment?.allowed && (
                  <>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Maximum Encashable Days"
                        value={formData.encashment?.maxDays}
                        onChange={(e) => setFormData({
                          ...formData,
                          encashment: { 
                            ...formData.encashment!, 
                            maxDays: parseInt(e.target.value) || 0
                          }
                        })}
                        inputProps={{ min: "0" }}
                        helperText="Maximum days that can be encashed per year"
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ mt: 1 }}>
                        <Typography variant="caption">
                          Encashment is typically paid at basic salary rate. Consider tax implications.
                        </Typography>
                      </Alert>
                    </Grid>
                  </>
                )}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Approval Workflow */}
        <Grid item xs={12}>
          <Accordion sx={{ mt: 1 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Approval Workflow
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Autocomplete
                multiple
                fullWidth
                options={roles.filter(r => r !== "All")}
                value={formData.approvalWorkflow}
                onChange={(event, newValue) => {
                  setFormData({ ...formData, approvalWorkflow: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Approval Sequence"
                    placeholder="Select roles in approval order"
                    helperText="Leave requests will be routed to these roles in sequence"
                  />
                )}
              />
              
              {(formData.approvalWorkflow?.length ?? 0) > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Approval Flow:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {(formData.approvalWorkflow ?? []).map((role, index) => (
                      <React.Fragment key={role}>
                        <Chip label={role} size="small" />
                        {index < (formData.approvalWorkflow?.length ?? 0) - 1 && (
                          <Typography variant="caption" color="text.secondary">
                            →
                          </Typography>
                        )}
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        </Grid>
        
        {/* Status */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2">Active Policy</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formData.isActive 
                      ? "This policy is active and will be applied to new leave requests" 
                      : "This policy is inactive and will not be available for new requests"}
                  </Typography>
                </Box>
              }
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  </DialogContent>
  
  <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
    <Button 
      onClick={() => setDialogOpen(false)}
      variant="outlined"
    >
      Cancel
    </Button>
    <Button 
      onClick={handleSubmit} 
      variant="contained"
      disabled={!formData.name || !formData.leaveType || !formData.accrual?.method}
      className="!text-white"
      startIcon={editMode ? <CheckCircle /> : <Add />}
    >
      {editMode ? "Update Policy" : "Create Policy"}
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default LeavePolicies;