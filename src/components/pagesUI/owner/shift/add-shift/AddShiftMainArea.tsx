// AddShift.tsx
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
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
import InputField from "@/components/elements/SharedInputs/InputField";

// Types
interface IShiftForm {
  shiftName: string;
  startTime: string;
  endTime: string;
  isNightShift: boolean;
  gracePeriod?: number;
  breakTimeSlots: BreakTimeSlot[];
  applicableLocations?: string[];
  activeStatus: boolean;
}

interface BreakTimeSlot {
  breakStart: string;
  breakEnd: string;
}

// Mock data
const OFFICE_LOCATIONS = [
  "Mumbai HQ",
  "Delhi Corporate Office",
  "Bangalore Branch",
  "Hyderabad Operations",
  "Chennai Branch",
  "Pune Support Center",
  "Kolkata East Branch",
  "Ahmedabad Zone Office",
  "Jaipur Regional Branch",
  "Surat Office"
];

const AddShift: React.FC = () => {
  const router = useRouter();
  const [expandedBreaks, setExpandedBreaks] = useState(false);
  const [breakSlots, setBreakSlots] = useState<BreakTimeSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    register,
    formState: { errors, isDirty },
  } = useForm<IShiftForm>({
    defaultValues: {
      shiftName: "",
      startTime: "09:00",
      endTime: "18:00",
      isNightShift: false,
      gracePeriod: 15,
      breakTimeSlots: [],
      applicableLocations: [],
      activeStatus: true,
    },
  });

  // Watch values
  const watchShiftName = watch("shiftName");
  const watchStartTime = watch("startTime");
  const watchEndTime = watch("endTime");
  const watchIsNightShift = watch("isNightShift");
  const watchActiveStatus = watch("activeStatus");

  // Calculate shift duration
  const calculateDuration = () => {
    if (!watchStartTime || !watchEndTime) return "";
    
    const start = new Date(`2000-01-01T${watchStartTime}`);
    const end = new Date(`2000-01-01T${watchEndTime}`);
    
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
    setValue("breakTimeSlots", updatedSlots);
  };

  const removeBreakSlot = (index: number) => {
    const updatedSlots = breakSlots.filter((_, i) => i !== index);
    setBreakSlots(updatedSlots);
    setValue("breakTimeSlots", updatedSlots);
  };

  const updateBreakSlot = (index: number, field: keyof BreakTimeSlot, value: string) => {
    const updatedSlots = [...breakSlots];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };
    setBreakSlots(updatedSlots);
    setValue("breakTimeSlots", updatedSlots);
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
    if (!data.shiftName.trim()) {
      toast.error("Shift Name is required");
      return;
    }

    if (!data.startTime || !data.endTime) {
      toast.error("Start Time and End Time are required");
      return;
    }

    // Validate time format
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(data.startTime) || !timeRegex.test(data.endTime)) {
      toast.error("Please enter valid time in HH:MM format");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const payload = {
        ...data,
        shiftId: `shift_${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedEmployees: 0,
      };

      console.log("Shift Payload:", payload);

      toast.success("Shift created successfully!");
      
      setTimeout(() => {
        router.push("/owner/shifts");
      }, 1000);
      
    } catch (error) {
      toast.error("Failed to create shift");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        router.push("/owner/shifts");
      }
    } else {
      router.push("/owner/shifts");
    }
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
                  <InputField
                    label="Shift Name *"
                    id="shiftName"
                    type="text"
                    required={true}
                    register={register("shiftName", { 
                      required: "Shift name is required" 
                    })}
                    error={errors.shiftName}
                  />

                  {/* Start Time & End Time */}
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <InputField
                        label="Start Time *"
                        id="startTime"
                        type="time"
                        required={true}
                        register={register("startTime", { 
                          required: "Start time is required",
                          pattern: {
                            value: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                            message: "Enter valid time (HH:MM)"
                          }
                        })}
                        error={errors.startTime}
                        defaultValue="09:00"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <InputField
                        label="End Time *"
                        id="endTime"
                        type="time"
                        required={true}
                        register={register("endTime", { 
                          required: "End time is required",
                          pattern: {
                            value: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
                            message: "Enter valid time (HH:MM)"
                          }
                        })}
                        error={errors.endTime}
                        defaultValue="18:00"
                      />
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
                          {watchStartTime} - {watchEndTime}
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
                                  <InputField
                                    label="Break Start"
                                    id={`breakStart-${index}`}
                                    type="time"
                                    required={false}
                                  />
                                  
                                  <Typography variant="body2" sx={{ mx: 1 }}>to</Typography>
                                  
                                  <InputField
                                    label="Break End"
                                    id={`breakEnd-${index}`}
                                    type="time"
                                    required={false}
                                  />
                                  
                                  <IconButton
                                    size="small"
                                    onClick={() => removeBreakSlot(index)}
                                    color="error"
                                    sx={{ ml: 1 }}
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
                </Box>
              </Grid>

              {/* Right Column */}
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Grace Period */}
                  <InputField
                    label="Grace Period (minutes)"
                    id="gracePeriod"
                    type="number"
                    required={false}
                    register={register("gracePeriod", {
                      min: { value: 0, message: "Grace period must be positive" },
                      max: { value: 60, message: "Grace period cannot exceed 60 minutes" }
                    })}
                    error={errors.gracePeriod}
                    defaultValue="15"
                  />

                  {/* Night Shift Toggle - Now independent and toggleable */}
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
                        name="isNightShift"
                        control={control}
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Switch
                                checked={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.checked);
                                  // Show warning if user manually toggles to night shift with unusual times
                                  if (e.target.checked && watchStartTime && watchEndTime) {
                                    const start = parseInt(watchStartTime.replace(':', ''));
                                    const end = parseInt(watchEndTime.replace(':', ''));
                                    if (end > start) {
                                      toast.info("Night shift enabled manually. Usually night shifts have End Time < Start Time.");
                                    }
                                  }
                                }}
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

                  {/* Applicable Office Locations */}
                  <Box>
                    <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOn fontSize="small" sx={{ mr: 1 }} />
                      Applicable Office Locations
                    </Typography>
                    <Controller
                      name="applicableLocations"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth size="small">
                          <Select
                            multiple
                            value={field.value || []}
                            onChange={field.onChange}
                            input={<OutlinedInput label="Locations" />}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {(selected as string[]).map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                            )}
                          >
                            {OFFICE_LOCATIONS.map((location) => (
                              <MenuItem key={location} value={location}>
                                <Checkbox checked={(field.value || []).includes(location)} />
                                <ListItemText primary={location} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                      Optional: Select locations where this shift applies
                    </Typography>
                  </Box>

                  {/* Active Status - Same toggle style as Night Shift */}
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
                        name="activeStatus"
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
                startIcon={<Save />}
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