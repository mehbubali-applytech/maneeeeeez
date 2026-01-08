// tabs/JobDetailsTab.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Alert,
  Paper,
  AlertColor
} from "@mui/material";
import {
  Work,
  Business,
  Person,
  LocationOn,
  AccessTime,
  CalendarToday,
  DateRange
} from "@mui/icons-material";
import { useFormContext, Controller } from "react-hook-form";
import InputField from "@/components/elements/SharedInputs/InputField";
import { EMPLOYMENT_STATUS_OPTIONS } from "../EmployeeTypes";

interface JobDetailsTabProps {
  watchWorkType: string;
}

// Mock data (would come from API in real app)
const ROLES = [
  { id: 1, name: "Software Engineer" },
  { id: 2, name: "Senior Software Engineer" },
  { id: 3, name: "Team Lead" },
  { id: 4, name: "Project Manager" },
  { id: 5, name: "HR Manager" },
  { id: 6, name: "Accountant" },
  { id: 7, name: "Sales Executive" },
  { id: 8, name: "Marketing Specialist" }
];

const DEPARTMENTS = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Human Resources" },
  { id: 3, name: "Finance" },
  { id: 4, name: "Sales" },
  { id: 5, name: "Marketing" },
  { id: 6, name: "Operations" },
  { id: 7, name: "Customer Support" }
];

const WORK_LOCATIONS = [
  { id: 1, name: "Mumbai HQ" },
  { id: 2, name: "Delhi Corporate Office" },
  { id: 3, name: "Bangalore Branch" },
  { id: 4, name: "Hyderabad Operations" },
  { id: 5, name: "Chennai Branch" },
  { id: 6, name: "Pune Support Center" }
];

const SHIFTS = [
  { id: 1, name: "Morning Shift", timing: "9:00 - 18:00" },
  { id: 2, name: "Evening Shift", timing: "14:00 - 23:00" },
  { id: 3, name: "Night Shift", timing: "21:00 - 6:00" },
  { id: 4, name: "Flexi Shift", timing: "10:00 - 19:00" }
];

const EMPLOYEES = [
  { id: "EMP001", name: "Rajesh Kumar", role: "Senior Software Engineer" },
  { id: "EMP002", name: "Priya Sharma", role: "Project Manager" },
  { id: "EMP003", name: "Amit Patel", role: "Team Lead" },
  { id: "EMP004", name: "Sneha Reddy", role: "HR Manager" }
];

const JobDetailsTab: React.FC<JobDetailsTabProps> = ({ watchWorkType }) => {
  const {
    control,
    watch,
    setValue,
    register,
    formState: { errors }
  } = useFormContext();

  const [probationEnabled, setProbationEnabled] = useState(false);

  const dateOfJoining = watch('dateOfJoining');
  const employmentStatus = watch('employmentStatus');

useEffect(() => {
  if (watchWorkType === 'Contract' && dateOfJoining) {
    setValue('contractStartDate', dateOfJoining, { shouldDirty: false });

    setValue('contractEndDate', (prev: any) => {
      if (prev) return prev;
      const end = new Date(dateOfJoining);
      end.setFullYear(end.getFullYear() + 1);
      return end.toISOString().split('T')[0];
    });
  }
}, [watchWorkType, dateOfJoining, setValue]);

  const handleProbationToggle = (enabled: boolean) => {
    setProbationEnabled(enabled);
    if (!enabled) {
      setValue('probationEndDate', undefined);
    }
  };

  const getEmploymentStatusColor = (status: string): AlertColor => {
    switch (status) {
      case "Active":
        return "success";
      case "On Probation":
        return "warning";
      case "Resigned":
        return "info";
      case "Terminated":
        return "error";
      case "Draft":
        return "info";
      default:
        return "info";
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{
        display: 'flex',
        alignItems: 'center',
        mb: 3
      }}>
        <Work sx={{ mr: 1 }} />
        Job Details & Employment
      </Typography>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <InputField
              label="Employee Code"
              id="employeeCode"
              type="text"
              required={false}
              register={register("employeeCode")}
            />

            {/* Date of Joining */}
            <InputField
              label="Date of Joining *"
              id="dateOfJoining"
              type="date"
              required={true}
              register={register("dateOfJoining", {
                required: "Date of joining is required"
              })}
            />

            {/* Probation Period */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center' }}>
                  <DateRange sx={{ mr: 1 }} />
                  Probation Period
                </Typography>
                <Chip
                  label={probationEnabled ? "Probation Enabled" : "No Probation"}
                  size="small"
                  color={probationEnabled ? "warning" : "default"}
                  variant={probationEnabled ? "filled" : "outlined"}
                  onClick={() => handleProbationToggle(!probationEnabled)}
                  sx={{ cursor: 'pointer' }}
                />
              </Box>

              {probationEnabled && (
                <InputField
                  label="Probation End Date"
                  id="probationEndDate"
                  type="date"
                  required={false}
                  register={register("probationEndDate")}
                />
              )}
            </Box>

            {/* Role Selection */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Work sx={{ mr: 1 }} />
                Role / Designation *
              </Typography>
              <Controller
                name="roleId"
                control={control}
                rules={{ required: "Role is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={ROLES}
                    getOptionLabel={(option) => option.name}
                    value={ROLES.find(role => role.id === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.id || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select a role"
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id}>
                        {option.name}
                      </MenuItem>
                    )}
                  />
                )}
              />
            </Box>

            {/* Department */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Business sx={{ mr: 1 }} />
                Department *
              </Typography>
              <Controller
                name="departmentId"
                control={control}
                rules={{ required: "Department is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={DEPARTMENTS}
                    getOptionLabel={(option) => option.name}
                    value={DEPARTMENTS.find(dept => dept.id === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.id || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select department"
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id}>
                        {option.name}
                      </MenuItem>
                    )}
                  />
                )}
              />
            </Box>

            {/* Reporting Manager */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Person sx={{ mr: 1 }} />
                Reporting Manager
              </Typography>
              <Controller
                name="reportingManagerId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={EMPLOYEES}
                    getOptionLabel={(option) => `${option.name} - ${option.role}`}
                    value={EMPLOYEES.find(emp => emp.id === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.id || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Search manager"
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id}>
                        <Box>
                          <Typography variant="body2">{option.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.role}
                          </Typography>
                        </Box>
                      </MenuItem>
                    )}
                  />
                )}
              />
            </Box>
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Work Location */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1 }} />
                Work Location / Office *
              </Typography>
              <Controller
                name="workLocationId"
                control={control}
                rules={{ required: "Work location is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={WORK_LOCATIONS}
                    getOptionLabel={(option) => option.name}
                    value={WORK_LOCATIONS.find(location => location.id === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.id || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select work location"
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id}>
                        {option.name}
                      </MenuItem>
                    )}
                  />
                )}
              />
            </Box>

            {/* Assigned Shift */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{ mr: 1 }} />
                Assigned Shift
              </Typography>
              <Controller
                name="shiftId"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    options={SHIFTS}
                    getOptionLabel={(option) => option.name}
                    value={SHIFTS.find(shift => shift.id === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.id || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select shift"
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.id}>
                        <Box>
                          <Typography variant="body2">{option.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.timing}
                          </Typography>
                        </Box>
                      </MenuItem>
                    )}
                    noOptionsText="No shifts available"
                  />
                )}
              />
            </Box>

            {/* Work Type */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                Work Type *
              </Typography>
              <Controller
                name="workType"
                control={control}
                rules={{ required: "Work type is required" }}
                render={({ field, fieldState }) => (
                  <FormControl error={fieldState.invalid}>
                    <RadioGroup {...field} row>
                      {['Full-time', 'Part-time', 'Contract', 'Intern'].map(type => (
                        <FormControlLabel
                          key={type}
                          value={type}
                          control={<Radio size="small" />}
                          label={
                            <Chip
                              label={type}
                              size="small"
                              variant={field.value === type ? "filled" : "outlined"}
                              color={field.value === type ? "primary" : "default"}
                            />
                          }
                        />
                      ))}
                    </RadioGroup>
                    {fieldState.error && (
                      <Typography variant="caption" color="error">
                        {fieldState.error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>

            {/* Contract Dates (Conditional) */}
            {watchWorkType === 'Contract' && (
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'info.50' }}>
                <Typography variant="subtitle2" gutterBottom sx={{ color: 'info.dark' }}>
                  Contract Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <InputField
                      label="Contract Start Date"
                      id="contractStartDate"
                      type="date"
                      required={true}
                      register={register("contractStartDate", {
                        required: "Contract start date is required"
                      })}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <InputField
                      label="Contract End Date"
                      id="contractEndDate"
                      type="date"
                      required={true}
                      register={register("contractEndDate", {
                        required: "Contract end date is required"
                      })}
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Employment Status */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Employment Status *
              </Typography>
              <Controller
                name="employmentStatus"
                control={control}
                rules={{ required: "Employment status is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={EMPLOYMENT_STATUS_OPTIONS}
                    getOptionLabel={(option) => option.label}
                    value={EMPLOYMENT_STATUS_OPTIONS.find(status => status.value === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.value || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Select employment status"
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.value}>
                        <Chip
                          label={option.label}
                          size="small"
                          color={option.color as any}
                          variant="outlined"
                          sx={{ mr: 1 }}
                        />
                      </MenuItem>
                    )}
                  />
                )}
              />
              {employmentStatus && (
                <Alert severity={getEmploymentStatusColor(employmentStatus)}
                  sx={{ mt: 1 }}
                  icon={false}
                >
                  <Typography variant="body2">
                    {getStatusDescription(watch('employmentStatus'))}
                  </Typography>
                </Alert>
              )}
            </Box>

            {/* Summary Card */}
            <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" gutterBottom>
                Job Summary
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Employment Type:
                  </Typography>
                  <Typography variant="body2">
                    {watch('workType') || 'Not set'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Status:
                  </Typography>
                  <Typography variant="body2">
                    {watch('employmentStatus') || 'Not set'}
                  </Typography>
                </Grid>
                {watch('dateOfJoining') && (
                  <Grid item xs={12}>
                    <Typography variant="caption" color="text.secondary">
                      Joining Date:
                    </Typography>
                    <Typography variant="body2">
                      {new Date(watch('dateOfJoining')).toLocaleDateString()}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const getStatusDescription = (status: string): string => {
  switch (status) {
    case 'Active': return 'Employee is actively working and receiving benefits';
    case 'On Probation': return 'Employee is under probation period';
    case 'Resigned': return 'Employee has submitted resignation';
    case 'Terminated': return 'Employee has been terminated';
    case 'Draft': return 'Employee record is being created';
    default: return '';
  }
};

export default JobDetailsTab;