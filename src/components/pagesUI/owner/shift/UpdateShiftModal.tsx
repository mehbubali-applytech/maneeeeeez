// UpdateShiftModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Switch,
  FormControlLabel,
  Chip,
  Box,
  Alert,
  Button,
  IconButton,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { IShift, IShiftForm, BreakTimeSlot, OFFICE_LOCATIONS, TIME_OPTIONS, calculateDuration, calculateTotalBreakTime } from "./ShiftTypes";
import InputField from "@/components/elements/SharedInputs/InputField";
import { Add, Delete, AccessTime, LocationOn, NightsStay } from "@mui/icons-material";

interface UpdateShiftModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  editData: IShift | null;
  onSave: (data: IShiftForm, shiftId: number) => void;
}

const UpdateShiftModal: React.FC<UpdateShiftModalProps> = ({
  open,
  setOpen,
  editData,
  onSave,
}) => {
  const [breakSlots, setBreakSlots] = useState<BreakTimeSlot[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    register,
    formState: { errors },
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
  const watchStartTime = watch("startTime");
  const watchEndTime = watch("endTime");
  const watchIsNightShift = watch("isNightShift");
  const watchActiveStatus = watch("activeStatus");

  // Load data when editData changes
  useEffect(() => {
    if (editData && open) {
      reset({
        shiftName: editData.shiftName,
        startTime: editData.startTime,
        endTime: editData.endTime,
        isNightShift: editData.isNightShift || false,
        gracePeriod: editData.gracePeriod || 15,
        breakTimeSlots: editData.breakTimeSlots || [],
        applicableLocations: editData.applicableLocations || [],
        activeStatus: editData.activeStatus,
      });
      setBreakSlots(editData.breakTimeSlots || []);
    }
  }, [editData, open, reset]);

  // Reset when closing
  useEffect(() => {
    if (!open) {
      setBreakSlots([]);
    }
  }, [open]);

  const handleToggle = () => setOpen(!open);

  // Calculate if it's a night shift
  useEffect(() => {
    if (watchStartTime && watchEndTime) {
      const start = parseInt(watchStartTime.replace(':', ''));
      const end = parseInt(watchEndTime.replace(':', ''));
      const isNight = end < start;
      setValue("isNightShift", isNight);
    }
  }, [watchStartTime, watchEndTime, setValue]);

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

  const onSubmit = async (data: IShiftForm) => {
    // Validate required fields
    if (!data.shiftName?.trim()) {
      toast.error("Shift Name is required");
      return;
    }

    if (!data.startTime || !data.endTime) {
      toast.error("Start Time and End Time are required");
      return;
    }

    setIsSubmitting(true);
    
    try {
      if (!editData?.shiftId) {
        toast.error("Shift ID is missing");
        return;
      }

      await onSave(data, editData.shiftId);
      toast.success("Shift updated successfully!");
      setOpen(false);
      
    } catch (error) {
      console.error("Error saving shift:", error);
      toast.error("Failed to update shift");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTotalBreakTime = () => {
    const totalMinutes = calculateTotalBreakTime(breakSlots);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={handleToggle} 
        fullWidth 
        maxWidth="md"
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: 900,
            width: '100%',
            margin: 2,
            maxHeight: 'calc(100vh - 64px)',
            borderRadius: '8px',
            overflow: 'hidden',
            '@media (max-width: 900px)': {
              margin: 1,
              maxWidth: 'calc(100% - 16px)',
            }
          }
        }}
      >
        <DialogTitle className="!py-3 !px-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h5 className="modal-title text-lg font-semibold">
              Edit Shift
            </h5>
            <button
              onClick={handleToggle}
              type="button"
              className="bd-btn-close"
            >
              <i className="fa-solid fa-xmark-large"></i>
            </button>
          </div>
        </DialogTitle>
        <DialogContent 
          className="common-scrollbar overflow-y-auto"
          sx={{ 
            maxHeight: 'calc(80vh - 120px)',
            padding: '24px !important'
          }}
        >
          {editData && (
            <Alert severity="info" sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <i className="fa-solid fa-info-circle mr-2"></i>
                <Typography variant="body2">
                  Editing shift: <strong>{editData.shiftName}</strong>
                  {editData.assignedEmployees && editData.assignedEmployees > 0 && (
                    <span> • Assigned to {editData.assignedEmployees} employee{editData.assignedEmployees !== 1 ? 's' : ''}</span>
                  )}
                </Typography>
              </Box>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-12 gap-y-2.5">
              {/* Left Column - Basic Info */}
              <div className="col-span-12 md:col-span-6">
                <div className="card__wrapper">
                  <h6 className="card__sub-title mb-4">Shift Details</h6>
                  
                  <div className="grid grid-cols-12 gap-y-5 gap-x-5 maxXs:gap-x-0">
                    {/* Shift Name */}
                    <div className="col-span-12">
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
                    </div>

                    {/* Start Time & End Time */}
                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group">
                        <label className="form-label flex items-center">
                          <AccessTime fontSize="small" className="mr-2" />
                          Start Time *
                        </label>
                        <Controller
                          name="startTime"
                          control={control}
                          rules={{ required: "Start time is required" }}
                          render={({ field, fieldState }) => (
                            <select
                              className={`form-control ${fieldState.error ? 'is-invalid' : ''}`}
                              {...field}
                            >
                              {TIME_OPTIONS.map((time) => (
                                <option key={time.value} value={time.value}>
                                  {time.label}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        {errors.startTime && (
                          <div className="invalid-feedback">{errors.startTime.message}</div>
                        )}
                      </div>
                    </div>

                    <div className="col-span-12 md:col-span-6">
                      <div className="form-group">
                        <label className="form-label flex items-center">
                          <AccessTime fontSize="small" className="mr-2" />
                          End Time *
                        </label>
                        <Controller
                          name="endTime"
                          control={control}
                          rules={{ required: "End time is required" }}
                          render={({ field, fieldState }) => (
                            <select
                              className={`form-control ${fieldState.error ? 'is-invalid' : ''}`}
                              {...field}
                            >
                              {TIME_OPTIONS.map((time) => (
                                <option key={time.value} value={time.value}>
                                  {time.label}
                                </option>
                              ))}
                            </select>
                          )}
                        />
                        {errors.endTime && (
                          <div className="invalid-feedback">{errors.endTime.message}</div>
                        )}
                      </div>
                    </div>

                    {/* Shift Duration Display */}
                    <div className="col-span-12">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <Typography variant="body2" className="font-medium text-blue-800">
                              Shift Duration
                            </Typography>
                            <Typography variant="h6" className="text-blue-900">
                              {calculateDuration(watchStartTime, watchEndTime, watchIsNightShift)}
                            </Typography>
                          </div>
                          {watchIsNightShift && (
                            <Chip
                              icon={<NightsStay />}
                              label="Night Shift"
                              color="primary"
                              variant="outlined"
                            />
                          )}
                        </div>
                        <Typography variant="caption" className="text-blue-700 mt-1">
                          {watchStartTime} - {watchEndTime}
                          {watchIsNightShift && " (Next Day)"}
                        </Typography>
                      </div>
                    </div>

                    {/* Break Time Slots */}
                    <div className="col-span-12">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h6 className="font-medium">Break Time Slots</h6>
                          <Button
                            size="small"
                            startIcon={<Add />}
                            onClick={addBreakSlot}
                            variant="outlined"
                          >
                            Add Break
                          </Button>
                        </div>
                        
                        {breakSlots.length === 0 ? (
                          <Alert severity="info">
                            No break slots added. Click {`"Add Break"`} to add break times.
                          </Alert>
                        ) : (
                          <div className="space-y-3">
                            {breakSlots.map((breakSlot, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className="flex-1 grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="form-label text-sm">Break Start</label>
                                    <select
                                      className="form-control form-control-sm"
                                      value={breakSlot.breakStart}
                                      onChange={(e) => updateBreakSlot(index, 'breakStart', e.target.value)}
                                    >
                                      {TIME_OPTIONS.map((time) => (
                                        <option key={time.value} value={time.value}>
                                          {time.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="form-label text-sm">Break End</label>
                                    <select
                                      className="form-control form-control-sm"
                                      value={breakSlot.breakEnd}
                                      onChange={(e) => updateBreakSlot(index, 'breakEnd', e.target.value)}
                                    >
                                      {TIME_OPTIONS.map((time) => (
                                        <option key={time.value} value={time.value}>
                                          {time.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <IconButton
                                  size="small"
                                  onClick={() => removeBreakSlot(index)}
                                  className="text-red-500"
                                >
                                  <Delete fontSize="small" />
                                </IconButton>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {breakSlots.length > 0 && (
                          <Typography variant="caption" className="text-gray-600 mt-2 block">
                            Total break time: {getTotalBreakTime()}
                          </Typography>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Additional Settings */}
              <div className="col-span-12 md:col-span-6">
                <div className="card__wrapper">
                  <h6 className="card__sub-title mb-4">Additional Settings</h6>
                  
                  <div className="grid grid-cols-12 gap-y-5 gap-x-5 maxXs:gap-x-0">
                    {/* Grace Period */}
                    <div className="col-span-12">
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
                    </div>

                    {/* Night Shift Toggle */}
                    <div className="col-span-12">
                      <div className="card__wrapper !border !border-gray-200 !rounded-lg !p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h6 className="font-medium mb-1 flex items-center">
                              <NightsStay fontSize="small" className="mr-2" />
                              Night Shift
                            </h6>
                            <p className="text-sm text-gray-600">
                              {watchIsNightShift 
                                ? "Shift ends on the next day (End Time < Start Time)" 
                                : "Regular day shift"}
                            </p>
                          </div>
                          <Controller
                            name="isNightShift"
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={
                                  <Switch
                                    checked={field.value}
                                    onChange={field.onChange}
                                    color="primary"
                                    disabled // Auto-calculated based on times
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
                        </div>
                      </div>
                    </div>

                    {/* Applicable Locations */}
                    <div className="col-span-12">
                      <div className="form-group">
                        <label className="form-label flex items-center">
                          <LocationOn fontSize="small" className="mr-2" />
                          Applicable Office Locations
                        </label>
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
                        <div className="form-text">
                          Optional: Select locations where this shift applies
                        </div>
                      </div>
                    </div>

                    {/* Active Status */}
                    <div className="col-span-12">
                      <div className="card__wrapper !border !border-gray-200 !rounded-lg !p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h6 className="font-medium mb-1">Active Status</h6>
                            <p className="text-sm text-gray-600">
                              {watchActiveStatus 
                                ? "Shift is active and available for assignment" 
                                : "Shift is inactive and hidden from assignment"}
                            </p>
                          </div>
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
                                    variant={field.value ? "filled" : "outlined"}
                                  />
                                }
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="submit__btn text-center mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="space-x-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => {
                      toast.info("Assign employees feature would open here");
                    }}
                  >
                    <i className="fa-regular fa-user-plus mr-2"></i>
                    Assign to Employees
                  </button>
                </div>
                <div className="space-x-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleToggle}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting || !watchStartTime || !watchEndTime}
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fa-regular fa-save mr-2"></i>
                        Update Shift
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateShiftModal;