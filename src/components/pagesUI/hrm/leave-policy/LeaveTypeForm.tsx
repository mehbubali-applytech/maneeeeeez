"use client";

import React, { useState, useEffect } from "react";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  FormControlLabel,
  Switch,
  Alert,
  Chip,
  Divider,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Paper,
  InputAdornment,
  Autocomplete
} from "@mui/material";
import {
  Close,
  Save,
  ArrowBack,
  ArrowForward
} from "@mui/icons-material";
import { 
  ILeaveType, 
  LEAVE_CATEGORIES, 
  ACCRUAL_METHODS, 
  GENDER_OPTIONS, 
  EMPLOYMENT_TYPES,
  ExpiresOnType,
  EmploymentType,
  GenderType,
  ProrationCalculationType
} from "./LeavePolicyTypes";

interface LeaveTypeFormProps {
  leaveType?: ILeaveType | null;
  mode: 'add' | 'edit';
  onClose: () => void;
  onSubmit: (data: ILeaveType) => void;
}

const LeaveTypeForm: React.FC<LeaveTypeFormProps> = ({
  leaveType,
  mode,
  onClose,
  onSubmit
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ILeaveType>({
    id: '',
    name: '',
    code: '',
    description: '',
    category: 'Casual',
    annualEntitlement: 12,
    maxContinuousDays: 3,
    minServiceDays: 90,
    accrualMethod: 'Monthly',
    carryForward: {
      allowed: false,
      maxDays: 0,
      validity: 3,
      expiresOn: 'Year End'
    },
    encashment: {
      allowed: false,
      maxDays: 0,
      rate: 0
    },
    noticePeriod: 2,
    requiresApproval: true,
    approvalWorkflow: ['manager_only'],
    supportingDocuments: false,
    eligibleGender: ['All'],
    eligibility: {
      employmentType: ['Full-time'],
      probationCompleted: true,
      department: ['All'],
      location: ['All'],
      designation: ['All']
    },
    prorate: {
      onJoining: true,
      onExit: true,
      calculation: 'Monthly'
    },
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'HR Manager'
  });

  const steps = ['Basic Information', 'Entitlement Rules', 'Eligibility & Restrictions', 'Review'];

  // Convert arrays to Autocomplete options format with proper typing
  const categoryOptions = LEAVE_CATEGORIES.map(cat => ({ value: cat.value, label: cat.label }));
  const accrualMethodOptions = ACCRUAL_METHODS.map(method => ({ value: method.value, label: method.label }));
  const genderOptions = GENDER_OPTIONS.map(gender => ({ value: gender.value, label: gender.label }));
  const employmentTypeOptions = EMPLOYMENT_TYPES.map(type => ({ value: type, label: type }));

  useEffect(() => {
    if (leaveType) {
      setFormData(leaveType);
    }
  }, [leaveType]);

  const handleNext = () => {
    setActiveStep((prevStep) => Math.min(prevStep + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      id: mode === 'add' ? `LT${Date.now()}` : formData.id,
      updatedAt: new Date().toISOString(),
      createdBy: mode === 'add' ? 'HR Manager' : formData.createdBy
    };
    onSubmit(finalData);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Leave Type Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter leave type name"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Leave Code *"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                helperText="Short code (e.g., CL for Casual Leave)"
                placeholder="CL, SL, EL, etc."
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                placeholder="Describe the purpose and usage of this leave type"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Autocomplete
                fullWidth
                options={categoryOptions}
                value={categoryOptions.find(opt => opt.value === formData.category) || null}
                onChange={(_, newValue) => {
                  if (newValue) {
                    setFormData({ ...formData, category: newValue.value as any });
                  }
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Category *"
                    placeholder="Select leave category"
                    required
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip 
                        label={option.label} 
                        size="small" 
                        color={option.value === 'Paid' ? 'success' : 
                               option.value === 'Unpaid' ? 'warning' : 
                               option.value === 'Sick' ? 'info' : 
                               option.value === 'Maternity' || option.value === 'Paternity' ? 'primary' : 
                               option.value === 'Compensatory' ? 'secondary' : 'default'}
                      />
                    </Box>
                  </li>
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Active"
                  labelPlacement="start"
                />
                <Chip 
                  label={formData.active ? "Active" : "Inactive"} 
                  size="small" 
                  color={formData.active ? "success" : "default"}
                  variant="outlined"
                />
              </Box>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Annual Entitlement (Days) *"
                value={formData.annualEntitlement}
                onChange={(e) => setFormData({ ...formData, annualEntitlement: Number(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">days</InputAdornment>,
                }}
                required
                placeholder="Enter number of days per year"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Max Continuous Days *"
                value={formData.maxContinuousDays}
                onChange={(e) => setFormData({ ...formData, maxContinuousDays: Number(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">days</InputAdornment>,
                }}
                required
                placeholder="Maximum consecutive days allowed"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Service Days Required"
                value={formData.minServiceDays}
                onChange={(e) => setFormData({ ...formData, minServiceDays: Number(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">days</InputAdornment>,
                }}
                placeholder="Minimum service required"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Autocomplete
                fullWidth
                options={accrualMethodOptions}
                value={accrualMethodOptions.find(opt => opt.value === formData.accrualMethod) || null}
                onChange={(_, newValue) => {
                  if (newValue) {
                    setFormData({ ...formData, accrualMethod: newValue.value as any });
                  }
                }}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Accrual Method"
                    placeholder="Select accrual method"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body2">{option.label}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {option.value === 'Monthly' ? 'Accrues monthly' :
                         option.value === 'Yearly' ? 'Credited yearly' : 'Accrues quarterly'}
                      </Typography>
                    </Box>
                  </li>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Chip label="Carry Forward Rules" size="small" />
              </Divider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.carryForward.allowed}
                    onChange={(e) => setFormData({
                      ...formData,
                      carryForward: { ...formData.carryForward, allowed: e.target.checked }
                    })}
                    color={formData.carryForward.allowed ? "primary" : "default"}
                  />
                }
                label="Allow Carry Forward"
                labelPlacement="start"
                sx={{ width: '100%', justifyContent: 'space-between' }}
              />
            </Grid>
            
            {formData.carryForward.allowed && (
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Maximum Carry Forward Days"
                    value={formData.carryForward.maxDays}
                    onChange={(e) => setFormData({
                      ...formData,
                      carryForward: { ...formData.carryForward, maxDays: Number(e.target.value) }
                    })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">days</InputAdornment>,
                    }}
                    placeholder="Maximum days that can be carried forward"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Validity Period"
                    value={formData.carryForward.validity}
                    onChange={(e) => setFormData({
                      ...formData,
                      carryForward: { ...formData.carryForward, validity: Number(e.target.value) }
                    })}
                    InputProps={{
                      endAdornment: <InputAdornment position="end">months</InputAdornment>,
                    }}
                    placeholder="Months for which carried forward leaves are valid"
                  />
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Autocomplete
                    fullWidth
                    options={[
                      { value: 'Year End' as ExpiresOnType, label: 'Year End' },
                      { value: 'Specific Month' as ExpiresOnType, label: 'Specific Month (e.g., March)' }
                    ]}
                    value={{ value: formData.carryForward.expiresOn, label: formData.carryForward.expiresOn }}
                    onChange={(_, newValue) => {
                      if (newValue) {
                        setFormData({
                          ...formData,
                          carryForward: { ...formData.carryForward, expiresOn: newValue.value }
                        });
                      }
                    }}
                    getOptionLabel={(option) => option.label}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Expires On"
                        placeholder="Select expiration period"
                      />
                    )}
                  />
                </Grid>
              </>
            )}
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Chip label="Encashment Rules" size="small" />
              </Divider>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                    <Switch
                      checked={formData.encashment.allowed}
                      onChange={(e) => setFormData({
                        ...formData,
                        encashment: { ...formData.encashment, allowed: e.target.checked }
                      })}
                      color={formData.encashment.allowed ? "primary" : "default"}
                    />
                  }
                  label="Allow Encashment"
                  labelPlacement="start"
                  sx={{ width: '100%', justifyContent: 'space-between' }}
                />
              </Grid>
              
              {formData.encashment.allowed && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Maximum Encashable Days"
                      value={formData.encashment.maxDays}
                      onChange={(e) => setFormData({
                        ...formData,
                        encashment: { ...formData.encashment, maxDays: Number(e.target.value) }
                      })}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">days</InputAdornment>,
                      }}
                      placeholder="Maximum days that can be encashed"
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Encashment Rate"
                      value={formData.encashment.rate}
                      onChange={(e) => setFormData({
                        ...formData,
                        encashment: { ...formData.encashment, rate: Number(e.target.value) }
                      })}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>,
                      }}
                      placeholder="Percentage of salary for encashment"
                      helperText="100% = Full day's salary"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          );
  
        case 2:
          return (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom color="primary">
                  Eligibility Criteria
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  multiple
                  options={employmentTypeOptions}
                  value={employmentTypeOptions.filter(opt => 
                    formData.eligibility.employmentType.includes(opt.value as EmploymentType)
                  )}
                  onChange={(_, newValue) => {
                    setFormData({
                      ...formData,
                      eligibility: { 
                        ...formData.eligibility, 
                        employmentType: newValue.map(v => v.value as EmploymentType) 
                      }
                    });
                  }}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Employment Type"
                      placeholder="Select employment types"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={option.label} 
                          size="small" 
                          variant="outlined"
                          color={option.value === 'Full-time' ? 'primary' : 
                                 option.value === 'Part-time' ? 'secondary' : 
                                 option.value === 'Contract' ? 'warning' : 'info'}
                        />
                      </Box>
                    </li>
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.value}
                        label={option.label}
                        size="small"
                        variant="outlined"
                        color={option.value === 'Full-time' ? 'primary' : 
                               option.value === 'Part-time' ? 'secondary' : 
                               option.value === 'Contract' ? 'warning' : 'info'}
                      />
                    ))
                  }
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  multiple
                  options={genderOptions}
                  value={genderOptions.filter(opt => 
                    formData.eligibleGender?.includes(opt.value as GenderType)
                  )}
                  onChange={(_, newValue) => {
                    setFormData({ 
                      ...formData, 
                      eligibleGender: newValue.map(v => v.value as GenderType) 
                    });
                  }}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Gender Eligibility"
                      placeholder="Select eligible genders"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props} key={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.value === 'All' && '👥'}
                        {option.value === 'Male' && '👨'}
                        {option.value === 'Female' && '👩'}
                        <Typography variant="body2">{option.label}</Typography>
                      </Box>
                    </li>
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option.value}
                        label={option.label}
                        size="small"
                        variant="outlined"
                        icon={option.value === 'All' ? <>👥</> : 
                              option.value === 'Male' ? <>👨</> : <>👩</>}
                      />
                    ))
                  }
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.eligibility.probationCompleted}
                      onChange={(e) => setFormData({
                        ...formData,
                        eligibility: { ...formData.eligibility, probationCompleted: e.target.checked }
                      })}
                      color="primary"
                    />
                  }
                  label="Require Probation Completion"
                  labelPlacement="start"
                  sx={{ width: '100%', justifyContent: 'space-between' }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Notice Period Required"
                  value={formData.noticePeriod}
                  onChange={(e) => setFormData({ ...formData, noticePeriod: Number(e.target.value) })}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">days</InputAdornment>,
                  }}
                  placeholder="Days notice required before taking leave"
                  helperText="0 = No notice required"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Approval Requirements" size="small" />
                </Divider>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.requiresApproval}
                      onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Requires Approval"
                  labelPlacement="start"
                  sx={{ width: '100%', justifyContent: 'space-between' }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.supportingDocuments}
                      onChange={(e) => setFormData({ ...formData, supportingDocuments: e.target.checked })}
                      color="primary"
                    />
                  }
                  label="Requires Supporting Documents"
                  labelPlacement="start"
                  sx={{ width: '100%', justifyContent: 'space-between' }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>
                  <Chip label="Proration Rules" size="small" />
                </Divider>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.prorate.onJoining}
                      onChange={(e) => setFormData({
                        ...formData,
                        prorate: { ...formData.prorate, onJoining: e.target.checked }
                      })}
                      color="primary"
                    />
                  }
                  label="Prorate on Joining"
                  labelPlacement="start"
                  sx={{ width: '100%', justifyContent: 'space-between' }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.prorate.onExit}
                      onChange={(e) => setFormData({
                        ...formData,
                        prorate: { ...formData.prorate, onExit: e.target.checked }
                      })}
                      color="primary"
                    />
                  }
                  label="Prorate on Exit"
                  labelPlacement="start"
                  sx={{ width: '100%', justifyContent: 'space-between' }}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Autocomplete
                  fullWidth
                  options={[
                    { value: 'Monthly' as ProrationCalculationType, label: 'Monthly Calculation' },
                    { value: 'Daily' as ProrationCalculationType, label: 'Daily Calculation' }
                  ]}
                  value={{ 
                    value: formData.prorate.calculation, 
                    label: `${formData.prorate.calculation} Calculation` 
                  }}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setFormData({
                        ...formData,
                        prorate: { ...formData.prorate, calculation: newValue.value }
                      });
                    }
                  }}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Proration Calculation"
                      placeholder="Select calculation method"
                      helperText="How to calculate prorated leave days"
                    />
                  )}
                />
              </Grid>
            </Grid>
          );
  
        case 3:
          return (
            <Box>
              <Typography variant="subtitle2" gutterBottom color="primary">
                Review Leave Type Configuration
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box>
                        <Typography variant="h6">{formData.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Code: {formData.code} | Category: {formData.category}
                        </Typography>
                      </Box>
                      <Chip 
                        label={formData.active ? "Active" : "Inactive"} 
                        size="small" 
                        color={formData.active ? "success" : "default"}
                      />
                    </Box>
                    {formData.description && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {formData.description}
                      </Typography>
                    )}
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  
                  <Grid item xs={6} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      Annual Entitlement
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formData.annualEntitlement} days
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      Max Continuous Days
                    </Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {formData.maxContinuousDays} days
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      Accrual Method
                    </Typography>
                    <Typography variant="body1">{formData.accrualMethod}</Typography>
                  </Grid>
                  
                  <Grid item xs={6} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      Carry Forward
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {formData.carryForward.allowed ? (
                        <>
                          <Chip 
                            label={`${formData.carryForward.maxDays} days`} 
                            size="small" 
                            color="success" 
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            ({formData.carryForward.validity} months)
                          </Typography>
                        </>
                      ) : (
                        <Chip label="Not Allowed" size="small" color="default" />
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      Encashment
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {formData.encashment.allowed ? (
                        <>
                          <Chip 
                            label={`${formData.encashment.maxDays} days`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                          <Typography variant="caption" color="text.secondary">
                            @ {formData.encashment.rate}%
                          </Typography>
                        </>
                      ) : (
                        <Chip label="Not Allowed" size="small" color="default" />
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={6} md={4}>
                    <Typography variant="caption" color="text.secondary">
                      Notice Period
                    </Typography>
                    <Typography variant="body1">
                      {formData.noticePeriod} days
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Eligibility
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {formData.eligibility.employmentType.map(type => (
                        <Chip key={type} label={type} size="small" variant="outlined" />
                      ))}
                      {formData.eligibleGender?.map(gender => (
                        <Chip key={gender} label={gender} size="small" variant="outlined" />
                      ))}
                      {formData.eligibility.probationCompleted && (
                        <Chip label="Probation Complete" size="small" variant="outlined" color="warning" />
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="caption" color="text.secondary">
                      Requirements
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {formData.requiresApproval && (
                        <Chip label="Requires Approval" size="small" variant="outlined" color="info" />
                      )}
                      {formData.supportingDocuments && (
                        <Chip label="Documents Required" size="small" variant="outlined" color="info" />
                      )}
                      {formData.prorate.onJoining && (
                        <Chip label="Prorate on Join" size="small" variant="outlined" color="secondary" />
                      )}
                      {formData.prorate.onExit && (
                        <Chip label="Prorate on Exit" size="small" variant="outlined" color="secondary" />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
              
              <Alert severity="info">
                <Typography variant="caption">
                  Review all settings before saving. Once created, you can modify the leave type at any time.
                </Typography>
              </Alert>
            </Box>
          );
  
        default:
          return null;
      }
    };
  
    return (
      <>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {mode === 'add' ? 'Add New Leave Type' : 'Edit Leave Type'}
            </Typography>
            <Button onClick={onClose} size="small">
              <Close />
            </Button>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Stepper activeStep={activeStep} orientation="vertical" sx={{ mb: 3 }}>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  {renderStepContent(index)}
                  
                  <Box sx={{ mt: 2 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mr: 1 }}
                      startIcon={<ArrowBack />}
                    >
                      Back
                    </Button>
                    
                    <Button
                      variant="contained"
                      onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                      className="!text-white"
                      endIcon={activeStep === steps.length - 1 ? null : <ArrowForward />}
                    >
                      {activeStep === steps.length - 1 ? 'Save Leave Type' : 'Next'}
                    </Button>
                  </Box>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            className="!text-white"
            startIcon={<Save />}
          >
            {mode === 'add' ? 'Create Leave Type' : 'Update Leave Type'}
          </Button>
        </DialogActions>
      </>
    );
  };
  
  export default LeaveTypeForm;