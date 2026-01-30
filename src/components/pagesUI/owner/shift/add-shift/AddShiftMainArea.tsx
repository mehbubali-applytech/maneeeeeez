"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Grid,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Paper,
  Divider,
  Chip,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  IconButton,
  Collapse,
  Card,
  CardContent,
  CircularProgress,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Save,
  Cancel,
  Add as AddIcon,
  Delete,
  AccessTime,
  LocationOn,
  NightsStay,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

import { IShiftForm, BreakTimeSlot } from "../ShiftTypes";
import { isAuthenticated } from "@/app/helpers/authChecker";



const AddShift = () => {
  const router = useRouter();
  const [expandedBreaks, setExpandedBreaks] = useState(false);
  const [breakSlots, setBreakSlots] = useState<BreakTimeSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState<Array<{ branch_id: number; branch_name: string }>>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(true);

  // Fetch branches on component mount
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoadingBranches(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/owner/branch/client`,
          {
            withCredentials: true
          }
        );
        console.log(response.data)
        if (response.data && response.data.data) {
          setBranches(response.data.data.map((branch: any) => ({
            branch_id: branch.id,
            branch_name: branch.branch_name,
          })));
        }
      } catch (error: any) {
         if (error.response?.status === 401) {
    router.push("/");
    return;
  }
        console.error("Error fetching branches:", error);
        toast.error("Failed to load branches");
      } finally {
        setIsLoadingBranches(false);
      }
    };

    fetchBranches();

  }, []);

      useEffect(() => {
      const checkAuth = async () => {
        const isAuth = await isAuthenticated();
        if (!isAuth) {
          router.push("/");
        }
      };
      checkAuth();
    },[])

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors, isDirty },
  } = useForm<IShiftForm>({
    defaultValues: {
      shift_name: "",
      start_time: "09:00:00",
      end_time: "18:00:00",
      is_night_shift: false,
      grace_period: 15,
      break_time_slots: [],
      branch_ids: [],
      active_status: true,
    },
  });

  // Watch values
  const watchShiftName = watch("shift_name");
  const watchStartTime = watch("start_time");
  const watchEndTime = watch("end_time");
  const watchIsNightShift = watch("is_night_shift");
  const watchActiveStatus = watch("active_status");

  // Calculate shift duration
  const calculateDuration = () => {
    if (!watchStartTime || !watchEndTime) return "";

    const formatTime = (time: string) => {
      const parts = time.split(':');
      return `${parts[0]}:${parts[1]}`;
    };

    const start = new Date(`2000-01-01T${formatTime(watchStartTime)}`);
    const end = new Date(`2000-01-01T${formatTime(watchEndTime)}`);

    if (watchIsNightShift) {
      end.setDate(end.getDate() + 1);
    }

    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  // Handle break time slots
  const addBreakSlot = () => {
    const newBreakSlot: BreakTimeSlot = {
      breakStart: "13:00",
      breakEnd: "13:30",
    };
    const updatedSlots = [...breakSlots, newBreakSlot];
    setBreakSlots(updatedSlots);
    setValue("break_time_slots", updatedSlots);
  };

  const removeBreakSlot = (index: number) => {
    const updatedSlots = breakSlots.filter((_, i) => i !== index);
    setBreakSlots(updatedSlots);
    setValue("break_time_slots", updatedSlots);
  };

  const updateBreakSlot = (index: number, field: keyof BreakTimeSlot, value: string) => {
    const updatedSlots = [...breakSlots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setBreakSlots(updatedSlots);
    setValue("break_time_slots", updatedSlots);
  };

  // Calculate total break time
  const calculateTotalBreakTime = () => {
    const totalMinutes = breakSlots.reduce((total, breakSlot) => {
      const start = new Date(`2000-01-01T${breakSlot.breakStart}`);
      const end = new Date(`2000-01-01T${breakSlot.breakEnd}`);
      const diffMs = end.getTime() - start.getTime();
      return total + Math.floor(diffMs / (1000 * 60));
    }, 0);

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const onSubmit = async (data: IShiftForm) => {
    // Validate required fields
    if (!data.shift_name.trim()) {
      toast.error("Shift Name is required");
      return;
    }

    if (!data.start_time || !data.end_time) {
      toast.error("Start Time and End Time are required");
      return;
    }

    // Ensure time format includes seconds
    const ensureTimeFormat = (time: string) => {
      if (time.length === 5) return `${time}:00`;
      return time;
    };

    setIsSubmitting(true);

    try {
      const payload = {
        ...data,
        start_time: ensureTimeFormat(data.start_time),
        end_time: ensureTimeFormat(data.end_time),
        break_time_slots: data.break_time_slots || [],
        branch_ids: data.branch_ids || [],
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/shift`,
        payload,
        {
          withCredentials: true
        }
      );

      if (response.status === 201) {
        toast.success("Shift created successfully!");

        setTimeout(() => {
          router.push("/owner/shift");
        }, 1000);
      } else {
        throw new Error(response.data.message || "Failed to create shift");
      }

    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push("/");
        return;
      }
      console.error("Error creating shift:", error);
      let errorMessage = "Failed to create shift";
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        router.push("/owner/shift");
      }
    } else {
      router.push("/owner/shift");
    }
  };

  const formatTimeForInput = (time: string) => {
    if (!time) return "";
    const parts = time.split(':');
    return `${parts[0]}:${parts[1]}`; // Remove seconds for input field
  };

  return (
    <div className="app__slide-wrapper">
      {/* Breadcrumb */}
      <div className="breadcrumb__wrapper mb-[25px]">
        <nav>
          <ol className="breadcrumb flex items-center mb-0">
            <li className="breadcrumb-item">
              <Link href="/">Home</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/owner">Owner</Link>
            </li>
            <li className="breadcrumb-item">
              <Link href="/owner/shift">Shifts</Link>
            </li>
            <li className="breadcrumb-item active">
              Add New Shift
            </li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: 'primary.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2
          }}>
            <AccessTime sx={{ fontSize: 32, color: 'primary.main' }} />
          </Box>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
              Create New Shift
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Define a new work shift with specific timing and settings
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Form Card */}
      <Paper elevation={0} sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        mb: 3
      }}>
        <Box sx={{
          p: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Shift Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Configure shift timing, breaks, and assignment settings
          </Typography>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 3 }}>
            {/* Two-column layout for desktop */}
            <Grid container spacing={4}>
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Shift Name */}
                  <div>
                    <label className="form-label">Shift Name *</label>
                    <input
                      className={`form-control ${errors.shift_name ? 'border-red-500' : ''}`}
                      placeholder="Enter shift name"
                      {...register("shift_name", {
                        required: "Shift name is required",
                        minLength: {
                          value: 2,
                          message: "Shift name must be at least 2 characters"
                        },
                        maxLength: {
                          value: 100,
                          message: "Shift name cannot exceed 100 characters"
                        }
                      })}
                    />
                    {errors.shift_name && (
                      <span className="text-red-500 text-sm">
                        {errors.shift_name.message}
                      </span>
                    )}
                  </div>

                  {/* Start Time & End Time */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <div>
                        <label className="form-label">Start Time *</label>
                        <input
                          type="time"
                          className={`form-control ${errors.start_time ? 'border-red-500' : ''}`}
                          {...register("start_time", {
                            required: "Start time is required"
                          })}
                          defaultValue="09:00"
                          step="300" // 5 minute steps
                        />
                        {errors.start_time && (
                          <span className="text-red-500 text-sm">
                            {errors.start_time.message}
                          </span>
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <label className="form-label">End Time *</label>
                        <input
                          type="time"
                          className={`form-control ${errors.end_time ? 'border-red-500' : ''}`}
                          {...register("end_time", {
                            required: "End time is required"
                          })}
                          defaultValue="18:00"
                          step="300" // 5 minute steps
                        />
                        {errors.end_time && (
                          <span className="text-red-500 text-sm">
                            {errors.end_time.message}
                          </span>
                        )}
                      </div>
                    </Grid>
                  </Grid>

                  {/* Shift Duration Display */}
                  <Paper variant="outlined" sx={{ p: 2, mt: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Shift Duration
                        </Typography>
                        <Typography variant="h6" color="primary">
                          {calculateDuration()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatTimeForInput(watchStartTime)} - {formatTimeForInput(watchEndTime)}
                          {watchIsNightShift && " (Next Day)"}
                        </Typography>
                      </Box>
                      {watchIsNightShift && (
                        <Chip
                          icon={<NightsStay />}
                          label="Night Shift"
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Paper>

                  {/* Grace Period */}
                  <div>
                    <label className="form-label">Grace Period (minutes)</label>
                    <input
                      type="number"
                      className={`form-control ${errors.grace_period ? 'border-red-500' : ''}`}
                      placeholder="Enter grace period in minutes"
                      {...register("grace_period", {
                        min: { value: 0, message: "Grace period must be positive" },
                        max: { value: 60, message: "Grace period cannot exceed 60 minutes" }
                      })}
                      defaultValue="15"
                    />
                    {errors.grace_period && (
                      <span className="text-red-500 text-sm">
                        {errors.grace_period.message}
                      </span>
                    )}
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Allowed late arrival time (0-60 minutes)
                    </Typography>
                  </div>
                </Box>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Break Time Slots */}
                  <Card variant="outlined">
                    <CardContent sx={{ p: '12px !important' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer'
                        }}
                        onClick={() => setExpandedBreaks(!expandedBreaks)}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Break Time Slots
                          </Typography>
                          <Chip
                            label={`${breakSlots.length} break${breakSlots.length !== 1 ? 's' : ''}`}
                            size="small"
                            variant="outlined"
                            color="info"
                          />
                        </Box>
                        <IconButton size="small">
                          {expandedBreaks ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>

                      <Collapse in={expandedBreaks}>
                        <Box sx={{ mt: 2 }}>
                          <Button
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={addBreakSlot}
                            variant="outlined"
                            sx={{ mb: 2 }}
                          >
                            Add Break
                          </Button>

                          {breakSlots.length === 0 ? (
                            <Alert severity="info" sx={{ mb: 2 }}>
                              No break slots added. Click {`"Add Break"`} to add break times.
                            </Alert>
                          ) : (
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {breakSlots.map((breakSlot, index) => (
                                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                                  <div style={{ flex: 1 }}>
                                    <label className="form-label text-sm">Break Start</label>
                                    <input
                                      type="time"
                                      className="form-control"
                                      value={breakSlot.breakStart}
                                      onChange={(e) => updateBreakSlot(index, 'breakStart', e.target.value)}
                                      step="300"
                                    />
                                  </div>

                                  <Typography variant="body2" sx={{ mx: 1 }}>to</Typography>

                                  <div style={{ flex: 1 }}>
                                    <label className="form-label text-sm">Break End</label>
                                    <input
                                      type="time"
                                      className="form-control"
                                      value={breakSlot.breakEnd}
                                      onChange={(e) => updateBreakSlot(index, 'breakEnd', e.target.value)}
                                      step="300"
                                    />
                                  </div>

                                  <IconButton
                                    size="small"
                                    onClick={() => removeBreakSlot(index)}
                                    color="error"
                                    sx={{ ml: 1, mt: 2 }}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              ))}

                              {breakSlots.length > 0 && (
                                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                                  Total break time: {calculateTotalBreakTime()}
                                </Typography>
                              )}
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn fontSize="small" sx={{ mr: 1 }} />
                      Applicable Branches
                    </Typography>

                    {isLoadingBranches ? (
                      <div className="flex items-center justify-center p-4">
                        <CircularProgress size={24} />
                        <span className="ml-2 text-gray-600">Loading branches...</span>
                      </div>
                    ) : branches.length === 0 ? (
                      <Alert severity="warning" sx={{ mb: 2 }}>
                        No branches available. Please create branches first.
                      </Alert>
                    ) : (
                      <Controller
                        name="branch_ids"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            multiple
                            options={branches}
                            getOptionLabel={(option) => option.branch_name}
                            value={branches.filter(branch => (field.value || []).includes(branch.branch_id))}
                            onChange={(_, newValue) => {
                              field.onChange(newValue.map(branch => branch.branch_id));
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Applicable Branches"
                                placeholder="Select branches..."
                                size="small"
                              />
                            )}
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  label={option.branch_name}
                                  size="small"
                                  {...getTagProps({ index })}
                                  sx={{
                                    bgcolor: 'primary.light',
                                    color: 'primary.contrastText',
                                    fontWeight: 500,
                                  }}
                                />
                              ))
                            }
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main',
                                  borderWidth: 2,
                                },
                              }
                            }}
                          />
                        )}
                      />
                    )}

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Select branches where this shift applies (leave empty for all branches)
                    </Typography>
                  </Box>

                  {/* Night Shift Toggle */}
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                          <NightsStay fontSize="small" sx={{ mr: 1 }} />
                          Night Shift
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {watchIsNightShift
                            ? "Shift ends on the next day"
                            : "Regular day shift (End Time > Start Time)"}
                        </Typography>
                      </Box>
                      <Controller
                        name="is_night_shift"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
                                checked={field.value}
                                onChange={field.onChange}
                                color="primary"
                              />
                            }
                            label={
                              <Chip
                                label={field.value ? "YES" : "NO"}
                                size="small"
                                color={field.value ? "primary" : "default"}
                                variant="outlined"
                              />
                            }
                          />
                        )}
                      />
                    </Box>
                  </Paper>

                  {/* Active Status */}
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="subtitle2" gutterBottom>
                          Active Status
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {watchActiveStatus
                            ? "This shift is active and available for assignment"
                            : "This shift is inactive and hidden from assignment"}
                        </Typography>
                      </Box>
                      <Controller
                        name="active_status"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
                                checked={field.value}
                                onChange={field.onChange}
                                color="success"
                              />
                            }
                            label={
                              <Chip
                                label={field.value ? "ACTIVE" : "INACTIVE"}
                                size="small"
                                color={field.value ? "success" : "default"}
                                variant="outlined"
                              />
                            }
                          />
                        )}
                      />
                    </Box>
                  </Paper>
                </Box>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Divider sx={{ my: 4 }} />
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2
            }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="!text-white"
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                disabled={isSubmitting || !watchShiftName?.trim() || !watchStartTime || !watchEndTime}
              >
                {isSubmitting ? "Creating..." : "Save Shift"}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      {/* Tips Card */}
      <Paper elevation={0} sx={{
        border: '1px solid',
        borderColor: 'info.light',
        borderRadius: 2,
        bgcolor: 'info.50',
        p: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
          <Box sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: 'info.light',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mr: 2,
            flexShrink: 0
          }}>
            <Typography variant="h6" sx={{ color: 'info.main' }}>💡</Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ color: 'info.dark', fontWeight: 600 }}>
              Shift Management Tips
            </Typography>
            <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
              <li>
                <Typography variant="body2">
                  <strong>Clear Naming:</strong> Use descriptive names like {`"Morning Shift", "Night Shift A", "Weekend Shift"`}
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Time Format:</strong> Use 24-hour format (HH:MM) - e.g., 09:00, 18:30, 22:00
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Night Shifts:</strong> Toggle ON when shift ends on next day (e.g., 21:00 to 06:00)
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Breaks:</strong> Add multiple break slots if employees have different break times
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Grace Period:</strong> Set reasonable grace periods (15-30 minutes) for flexibility
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Active Status:</strong> Set to inactive to temporarily disable a shift without deleting it
                </Typography>
              </li>
            </Box>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default AddShift;