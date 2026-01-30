"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Switch,
  CircularProgress,
  Alert,
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
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
  Button,
  Divider,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { IShift, IShiftForm, BreakTimeSlot } from "./ShiftTypes";
import {
  AccessTime,
  LocationOn,
  NightsStay,
  ExpandMore,
  ExpandLess,
  Add as AddIcon,
  Delete,
  Save,
  Cancel,
} from "@mui/icons-material";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editData: IShift | null;
  onSave: (payload: IShiftForm, shiftId: number) => Promise<void>;
}

const UpdateShiftModal: React.FC<Props> = ({
  open,
  setOpen,
  editData,
  onSave,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    register,
    formState: { errors, isDirty },
  } = useForm<IShiftForm>();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [expandedBreaks, setExpandedBreaks] = useState(false);
  const [breakSlots, setBreakSlots] = useState<BreakTimeSlot[]>([]);
  const [branches, setBranches] = useState<Array<{ branch_id: number; branch_name: string }>>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);

  // Fetch branches when modal opens
  useEffect(() => {
    if (open) {
      const fetchBranches = async () => {
        try {
          setIsLoadingBranches(true);
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/owner/branch/client`,
            {
              withCredentials: true
            }
          );

          if (response.data && response.data.data) {
            setBranches(response.data.data.map((branch: any) => ({
              branch_id: branch.id,
              branch_name: branch.branch_name,
            })));
          }
        } catch (error: any) {
          console.error("Error fetching branches:", error);
          toast.error("Failed to load branches");
        } finally {
          setIsLoadingBranches(false);
        }
      };

      fetchBranches();
    }
  }, [open]);

 useEffect(() => {
  if (editData) {
    // Parse break_time_slots from string or array
    const breakSlotsData = Array.isArray(editData.break_time_slots)
      ? editData.break_time_slots
      : (typeof editData.break_time_slots === 'string'
        ? JSON.parse(editData.break_time_slots)
        : []);

    setBreakSlots(breakSlotsData || []);

    // Safely extract branch_ids from Branches array
    let branchIds: number[] = [];
    
    if (editData.Branches && Array.isArray(editData.Branches)) {
      branchIds = editData.Branches
        .map(branch => {
          // Try different possible property names for branch_id
          return branch.branch_id || 
                 branch.id || 
                 (branch.shift_branch ? branch.shift_branch.branch_id : null);
        })
        .filter(id => id !== null && id !== undefined && Number.isInteger(Number(id)))
        .map(id => Number(id));
    }

    reset({
      shift_name: editData.shift_name,
      start_time: editData.start_time,
      end_time: editData.end_time,
      is_night_shift: editData.is_night_shift,
      grace_period: editData.grace_period,
      break_time_slots: breakSlotsData || [],
      branch_ids: branchIds, // Use the cleaned array
      active_status: editData.active_status,
    });
  }
}, [editData, reset]);

  // Watch values
  const watchStartTime = watch("start_time");
  const watchEndTime = watch("end_time");
  const watchIsNightShift = watch("is_night_shift");
  const watchActiveStatus = watch("active_status");

  // Calculate shift duration
  const calculateDuration = () => {
    if (!watchStartTime || !watchEndTime) return "";

    const formatTime = (time: string) => {
      if (!time) return "";
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

const onSubmit = async (data: IShiftForm) => {
  if (!editData) return;

  setIsSubmitting(true);

  try {
    // Clean branch_ids to remove any null/undefined values
    const cleanBranchIds = (data.branch_ids || [])
      .filter(id => id !== null && id !== undefined && Number.isInteger(Number(id)))
      .map(id => Number(id));

    const payload = {
      ...data,
      branch_ids: cleanBranchIds,
    };

    console.log("Submitting payload:", payload);

    // Call the parent handler
    await onSave(payload, editData.shift_id);

  } catch (error: any) {
    console.error("Error updating shift:", error);

    let errorMessage = "Failed to update shift";
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

  const formatTimeForInput = (time: string) => {
    if (!time) return "";
    const parts = time.split(':');
    return `${parts[0]}:${parts[1]}`; // Remove seconds for input field
  };

  if (!editData) return null;

  return (
    <Dialog
      open={open}
      onClose={() => !isSubmitting && setOpen(false)}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'grey.50',
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <AccessTime sx={{ color: 'primary.main' }} />
        <Box>
          <Typography variant="h6">Update Shift</Typography>
          <Typography variant="body2" color="text.secondary">
            Editing: <strong>{editData.shift_name}</strong>
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ p: 3 }}>
            {/* Two-column layout */}
            <Grid container spacing={3}>
              {/* Left Column */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Shift Name */}
                  <div>
                    <label className="form-label">Shift Name *</label>
                    <input
                      className={`form-control ${errors.shift_name ? 'border-red-500' : ''}`}
                      placeholder="Enter shift name"
                      disabled={isSubmitting}
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
                          disabled={isSubmitting}
                          {...register("start_time", {
                            required: "Start time is required"
                          })}
                          step="300"
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
                          disabled={isSubmitting}
                          {...register("end_time", {
                            required: "End time is required"
                          })}
                          step="300"
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
                      disabled={isSubmitting}
                      {...register("grace_period", {
                        min: { value: 0, message: "Grace period must be positive" },
                        max: { value: 60, message: "Grace period cannot exceed 60 minutes" }
                      })}
                    />
                    {errors.grace_period && (
                      <span className="text-red-500 text-sm">
                        {errors.grace_period.message}
                      </span>
                    )}
                  </div>
                </Box>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                        <IconButton size="small" disabled={isSubmitting}>
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
                            disabled={isSubmitting}
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
                                      disabled={isSubmitting}
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
                                      disabled={isSubmitting}
                                    />
                                  </div>

                                  <IconButton
                                    size="small"
                                    onClick={() => removeBreakSlot(index)}
                                    color="error"
                                    sx={{ ml: 1, mt: 2 }}
                                    disabled={isSubmitting}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Collapse>
                    </CardContent>
                  </Card>

                  {/* Applicable Branches */}
                  <Box>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 1
                      }}
                    >
                      <LocationOn fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                      Applicable Branches
                    </Typography>

                    {isLoadingBranches ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          p: 3,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          bgcolor: 'grey.50',
                          minHeight: 56
                        }}
                      >
                        <CircularProgress size={20} sx={{ mr: 1.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          Loading branches...
                        </Typography>
                      </Box>
                    ) : branches.length === 0 ? (
                      <Alert
                        severity="warning"
                        sx={{
                          mb: 2,
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2">
                          No branches available. Please create branches first.
                        </Typography>
                      </Alert>
                    ) : (
                      <Controller
                        name="branch_ids"
                        control={control}
                        render={({ field }) => (
                          <FormControl fullWidth size="small">
                            <InputLabel
                              id="branch-select-label"
                              sx={{
                                backgroundColor: 'background.paper',
                                px: 0.5,
                                '&.Mui-focused': {
                                  color: 'primary.main',
                                }
                              }}
                            >
                              Select branches
                            </InputLabel>
                            <Select
                              labelId="branch-select-label"
                              multiple
                              value={field.value || []}
                              onChange={field.onChange}
                              input={<OutlinedInput label="Select branches" />}
                              renderValue={(selected) => {
                                if ((selected as number[]).length === 0) {
                                  return (
                                    <Typography variant="body2" color="text.secondary">
                                      No branches selected
                                    </Typography>
                                  );
                                }

                                const selectedBranches = branches
                                  .filter(branch => (selected as number[]).includes(branch.branch_id));

                                return (
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, py: 0.5 }}>
                                    {selectedBranches.slice(0, 2).map((branch) => (
                                      <Chip
                                        key={branch.branch_id}
                                        label={branch.branch_name}
                                        size="small"
                                        sx={{
                                          bgcolor: 'primary.main',
                                          color: 'white',
                                          fontWeight: 500,
                                          height: 24,
                                          '& .MuiChip-label': {
                                            px: 1,
                                            py: 0.25,
                                          }
                                        }}
                                      />
                                    ))}
                                    {(selected as number[]).length > 2 && (
                                      <Chip
                                        label={`+${(selected as number[]).length - 2} more`}
                                        size="small"
                                        sx={{
                                          bgcolor: 'grey.100',
                                          color: 'text.secondary',
                                          fontWeight: 500,
                                          height: 24,
                                          '& .MuiChip-label': {
                                            px: 1,
                                            py: 0.25,
                                          }
                                        }}
                                      />
                                    )}
                                  </Box>
                                );
                              }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    maxHeight: 250,
                                    mt: 1,
                                    '& .MuiMenuItem-root': {
                                      py: 1,
                                      '&:hover': {
                                        bgcolor: 'primary.light',
                                        color: 'white',
                                        '& .MuiTypography-root': {
                                          color: 'white',
                                        },
                                        '& .MuiCheckbox-root': {
                                          color: 'white',
                                        }
                                      },
                                      '&.Mui-selected': {
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                          bgcolor: 'primary.dark',
                                        },
                                        '& .MuiTypography-root': {
                                          color: 'white',
                                        },
                                        '& .MuiCheckbox-root': {
                                          color: 'white',
                                          '&.Mui-checked': {
                                            color: 'white',
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }}
                              sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'grey.300',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'primary.main',
                                  borderWidth: 2,
                                },
                                '& .MuiSelect-select': {
                                  minHeight: '40px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  py: 1,
                                }
                              }}
                              disabled={isSubmitting}
                            >
                              <MenuItem
                                dense
                                onClick={() => {
                                  if (field.value?.length === branches.length) {
                                    field.onChange([]);
                                  } else {
                                    field.onChange(branches.map(b => b.branch_id));
                                  }
                                }}
                                sx={{
                                  borderBottom: '1px solid',
                                  borderColor: 'divider',
                                  mb: 0.5,
                                  fontWeight: 600,
                                  '&:hover': {
                                    bgcolor: 'transparent',
                                    color: 'inherit',
                                  }
                                }}
                              >
                                <Checkbox
                                  checked={field.value?.length === branches.length}
                                  indeterminate={field.value?.length > 0 && field.value?.length < branches.length}
                                  sx={{
                                    color: 'primary.main',
                                    '&.Mui-checked': {
                                      color: 'primary.main',
                                    },
                                  }}
                                />
                                <ListItemText
                                  primary={
                                    <Typography variant="subtitle2">
                                      {field.value?.length === branches.length
                                        ? "Deselect All"
                                        : "Select All"
                                      }
                                    </Typography>
                                  }
                                />
                              </MenuItem>

                              <Divider sx={{ my: 0.5 }} />

                              {branches.map((branch) => (
                                <MenuItem
                                  key={branch.branch_id}
                                  value={branch.branch_id}
                                  dense
                                  sx={{
                                    borderRadius: 0.5,
                                    mx: 0.5,
                                    my: 0.25,
                                    '&.Mui-selected': {
                                      bgcolor: 'primary.main',
                                      color: 'white',
                                      '&:hover': {
                                        bgcolor: 'primary.dark',
                                      }
                                    }
                                  }}
                                >
                                  <Checkbox
                                    checked={(field.value || []).includes(branch.branch_id)}
                                    sx={{
                                      color: 'primary.main',
                                      '&.Mui-checked': {
                                        color: 'white',
                                      },
                                    }}
                                  />
                                  <ListItemText
                                    primary={
                                      <Typography
                                        variant="body2"
                                        sx={{
                                          color: (field.value || []).includes(branch.branch_id)
                                            ? 'white'
                                            : 'inherit',
                                          fontWeight: (field.value || []).includes(branch.branch_id)
                                            ? 600
                                            : 400,
                                        }}
                                      >
                                        {branch.branch_name}
                                      </Typography>
                                    }
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    )}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        mt: 1,
                        display: 'block',
                        fontStyle: 'italic'
                      }}
                    >
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
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
            <Divider sx={{ my: 3 }} />
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2
            }}>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="!text-white"
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Save />}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update Shift"}
              </Button>
            </Box>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateShiftModal;