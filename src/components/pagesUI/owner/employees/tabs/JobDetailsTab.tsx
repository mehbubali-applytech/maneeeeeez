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
  AlertColor,
  CircularProgress
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
  departments?: any[];
  designations?: any[];
  branches?: any[];
  isLoading?: boolean;
}

const JobDetailsTab: React.FC<JobDetailsTabProps> = ({
  watchWorkType,
  departments = [],
  designations = [],
  branches = [],
  isLoading = false
}) => {
  const {
    control,
    watch,
    setValue,
    register,
    trigger,
    formState: { errors }
  } = useFormContext();

  const [probationEnabled, setProbationEnabled] = useState(false);
  const [reportingManagers, setReportingManagers] = useState<any[]>([]);

  const dateOfJoining = watch('dateOfJoining');
  const employmentStatus = watch('employmentStatus');
  const departmentId = watch('departmentId');

  // Fetch reporting managers based on department
  useEffect(() => {
    const fetchReportingManagers = async () => {
      if (departmentId) {
        try {
          // You'll need to create this API endpoint
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/owner/employee/department/${departmentId}/managers`,
            {
              credentials: 'include'
            }
          );
          const data = await response.json();
          if (data.success) {
            setReportingManagers(data.data);
          }
        } catch (error) {
          console.error("Error fetching reporting managers:", error);
        }
      }
    };

    fetchReportingManagers();
  }, [departmentId]);

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

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <CircularProgress />
      </Box>
    );
  }

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
                    options={departments}
                    getOptionLabel={(option) => option.dept_name}
                    value={departments.find(dept => dept.dept_id === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.dept_id || '')}
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
                      <MenuItem {...props} key={option.dept_id}>
                        {option.dept_name}
                      </MenuItem>
                    )}
                    loading={isLoading}
                  />
                )}
              />
            </Box>

            {/* Designation */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Work sx={{ mr: 1 }} />
                Designation *
              </Typography>
              <Controller
                name="designation"
                control={control}
                rules={{ required: "Designation is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    freeSolo
                    options={designations.map(d => d.designation_name)}
                    value={field.value || ''}
                    onChange={(_, value) => field.onChange(value || '')}
                    onInputChange={(_, value) => field.onChange(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Enter or select designation"
                        error={fieldState.invalid}
                        helperText={fieldState.error?.message}
                      />
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
                    options={reportingManagers}
                    getOptionLabel={(option) => `${option.first_name} ${option.last_name} (${option.employee_code})`}
                    value={reportingManagers.find(emp => emp.employee_id === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.employee_id || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        placeholder="Search manager"
                      />
                    )}
                    renderOption={(props, option) => (
                      <MenuItem {...props} key={option.employee_id}>
                        <Box>
                          <Typography variant="body2">
                            {option.first_name} {option.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.designation} • {option.employee_code}
                          </Typography>
                        </Box>
                      </MenuItem>
                    )}
                    disabled={!departmentId}
                  />
                )}
              />
            </Box>
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Branch/Work Location */}
            <Box>
              <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1 }} />
                Branch / Work Location *
              </Typography>
              <Controller
                name="workLocationId"
                control={control}
                rules={{ required: "Work location is required" }}
                render={({ field, fieldState }) => (
                  <Autocomplete
                    options={branches}
                    getOptionLabel={(option) => option.branch_name}
                    value={branches.find(branch => branch.branch_id === field.value) || null}
                    onChange={(_, value) => field.onChange(value?.branch_id || '')}
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
                      <MenuItem {...props} key={option.branch_id}>
                        <Box>
                          <Typography variant="body2">{option.branch_name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {option.address}
                          </Typography>
                        </Box>
                      </MenuItem>
                    )}
                  />
                )}
              />
            </Box>

            {/* Work Type */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
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