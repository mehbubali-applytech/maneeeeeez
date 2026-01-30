"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { IHoliday, HolidayFormData } from "./HolidayTypes";
import { statePropsType } from "@/interface/common.interface";

interface Props extends statePropsType {
  editData: IHoliday;
  onSave: (payload: any) => void;
}

const UpdateHolidayModal: React.FC<Props> = ({
  open,
  setOpen,
  editData,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HolidayFormData>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  useEffect(() => {
    if (editData) {
      reset({
        holiday_id: editData.holiday_id || editData.holidayId,
        name: editData.name,
        holiday_date: editData.holiday_date || editData.date,
        description: editData.description || "",
        status: editData.status,
      });
    }
  }, [editData, reset]);

  const onSubmit = async (data: HolidayFormData) => {
    if (!editData) return;
    
    setIsSubmitting(true);
    try {
      const payload = {
        id: editData.id,
        holiday_id: data.holiday_id || editData.holiday_id,
        name: data.name,
        holiday_date: data.holiday_date,
        description: data.description || "",
        status: data.status || "Active",
      };

      await onSave(payload);
      toast.success("Holiday updated successfully!");
      setOpen(false);
    } catch (error: any) {
      console.error("Error updating holiday:", error);
      toast.error(error.message || "Failed to update holiday");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!editData) return null;

  return (
    <Dialog 
      open={open} 
      onClose={() => !isSubmitting && setOpen(false)} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '12px',
        }
      }}
    >
      <DialogTitle sx={{ fontSize: '18px', fontWeight: 600, padding: '20px 24px 16px' }}>
        Update Holiday
      </DialogTitle>
      <DialogContent sx={{ padding: '0 24px 24px' }}>
        {editData && (
          <Alert 
            severity="info" 
            sx={{ 
              mb: 3, 
              borderRadius: '8px',
              '& .MuiAlert-message': {
                width: '100%',
              }
            }}
          >
            <div className="flex justify-between items-center w-full">
              <span>
                Updating: <strong className="text-blue-700">{editData.name}</strong>
              </span>
              {editData.holiday_id && (
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  ID: {editData.holiday_id}
                </span>
              )}
            </div>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            {/* Holiday Name Field with increased height */}
            <div className="col-span-12">
              <TextField
                fullWidth
                label="Holiday Name *"
                {...register("name", { 
                  required: "Holiday name is required",
                  minLength: {
                    value: 2,
                    message: "Holiday name must be at least 2 characters"
                  }
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={isSubmitting}
                sx={{
                  '& .MuiInputBase-root': {
                    height: '56px',
                    borderRadius: '8px',
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '14px 16px',
                    fontSize: '15px',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '15px',
                    top: '-2px',
                    '&.Mui-focused': {
                      top: '0px',
                      color: '#1976d2',
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                  marginBottom: 1,
                }}
              />
            </div>

            {/* Date Field with increased height */}
            <div className="col-span-6">
              <TextField
                fullWidth
                type="date"
                label="Date *"
                InputLabelProps={{ shrink: true }}
                {...register("holiday_date", { 
                  required: "Date is required" 
                })}
                error={!!errors.holiday_date}
                helperText={errors.holiday_date?.message}
                disabled={isSubmitting}
                sx={{
                  '& .MuiInputBase-root': {
                    height: '56px',
                    borderRadius: '8px',
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '14px 16px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '15px',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '15px',
                    top: '-8px',
                    '&.Mui-focused': {
                      top: '0px',
                      color: '#1976d2',
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                  marginBottom: 1,
                }}
              />
            </div>

            {/* Holiday ID Field with increased height (read-only) */}
            <div className="col-span-6">
              <TextField
                fullWidth
                label="Holiday ID"
                {...register("holiday_id")}
                disabled={true} // Make holiday ID read-only for updates
                sx={{
                  '& .MuiInputBase-root': {
                    height: '56px',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '14px 16px',
                    fontSize: '15px',
                    color: '#666',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '15px',
                    top: '-2px',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  marginBottom: 1,
                }}
                InputProps={{
                  readOnly: true,
                  sx: {
                    '&.Mui-disabled': {
                      backgroundColor: '#f5f5f5',
                      color: '#666',
                    }
                  }
                }}
              />
            </div>

            {/* Status Field with increased height dropdown */}
            <div className="col-span-6">
              <TextField
                select
                fullWidth
                label="Status"
                {...register("status")}
                error={!!errors.status}
                helperText={errors.status?.message}
                disabled={isSubmitting}
                sx={{
                  '& .MuiInputBase-root': {
                    height: '56px',
                    borderRadius: '8px',
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '14px 16px',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '15px',
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '15px',
                    top: '-8px',
                    '&.Mui-focused': {
                      top: '0px',
                      color: '#1976d2',
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                  marginBottom: 1,
                }}
                InputProps={{
                  sx: {
                    '& .MuiSelect-select': {
                      minHeight: '56px !important',
                      display: 'flex',
                      alignItems: 'center',
                    }
                  }
                }}
                SelectProps={{
                  MenuProps: {
                    PaperProps: {
                      sx: {
                        borderRadius: '8px',
                        marginTop: '4px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        maxHeight: 400,
                        '& .MuiMenuItem-root': {
                          minHeight: '56px',
                          fontSize: '15px',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0 16px',
                          '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.08)',
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(25, 118, 210, 0.12)',
                            '&:hover': {
                              backgroundColor: 'rgba(25, 118, 210, 0.16)',
                            }
                          }
                        }
                      }
                    }
                  }
                }}
              >
                <MenuItem 
                  value="Active" 
                  sx={{ 
                    minHeight: '56px', 
                    fontSize: '15px',
                    color: '#2e7d32',
                  }}
                >
                  <span className="flex items-center gap-3 w-full">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    <span className="font-medium">Active</span>
                  </span>
                </MenuItem>
                <MenuItem 
                  value="Inactive" 
                  sx={{ 
                    minHeight: '56px', 
                    fontSize: '15px',
                    color: '#757575',
                  }}
                >
                  <span className="flex items-center gap-3 w-full">
                    <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                    <span className="font-medium">Inactive</span>
                  </span>
                </MenuItem>
              </TextField>
            </div>

            {/* Description Field */}
            <div className="col-span-12">
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                {...register("description")}
                disabled={isSubmitting}
                placeholder="Enter holiday description (optional)"
                sx={{
                  '& .MuiInputLabel-root': {
                    fontSize: '15px',
                  },
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& textarea': {
                      padding: '12px 16px',
                      fontSize: '15px',
                    }
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e0e0e0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#1976d2',
                  },
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <Box sx={{ 
            display: "flex", 
            justifyContent: "flex-end", 
            gap: 3, 
            mt: 4, 
            pt: 3, 
            borderTop: 1, 
            borderColor: "divider" 
          }}>
            <button
              type="button"
              className="btn btn-secondary px-5 py-2.5 h-12 min-h-[48px] rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              style={{
                border: '1px solid #e0e0e0',
                backgroundColor: 'white',
                color: '#424242',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2 px-5 py-2.5 h-12 min-h-[48px] rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              disabled={isSubmitting}
              style={{
                backgroundColor: '#1976d2',
                color: 'white',
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={18} color="inherit" />
                  Updating...
                </>
              ) : (
                <>
                  <i className="fa-regular fa-save"></i>
                  Update Holiday
                </>
              )}
            </button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateHolidayModal;