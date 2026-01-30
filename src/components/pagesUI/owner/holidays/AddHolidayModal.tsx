"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { HolidayFormData } from "./HolidayTypes";
import { statePropsType } from "@/interface/common.interface";
import InputField from "@/components/elements/SharedInputs/InputField";

interface Props extends statePropsType {
  onSave: (payload: any) => void;
}

const AddHolidayModal: React.FC<Props> = ({ open, setOpen, onSave }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<HolidayFormData>();

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      reset({
        name: "",
        holiday_date: "",
        holiday_id: `HOL-${Date.now().toString().slice(-6)}`,
        description: "",
        status: "Active",
      });
    }
  }, [open, reset]);

  const onSubmit = async (data: HolidayFormData) => {
    if (!data.name || !data.holiday_date) {
      toast.error("Name and date are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        holiday_id: data.holiday_id || `HOL-${Date.now().toString().slice(-6)}`,
        name: data.name,
        holiday_date: data.holiday_date,
        description: data.description || "",
        status: data.status || "Active",
      };

      await onSave(payload);
      toast.success("Holiday added successfully!");
      setOpen(false);
    } catch (error: any) {
      console.error("Error adding holiday:", error);
      toast.error(error.message || "Failed to add holiday");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={() => !isSubmitting && setOpen(false)} 
      fullWidth 
      maxWidth="sm"
    >
      <DialogTitle>Add New Holiday</DialogTitle>
      <DialogContent>
        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Note:</strong> Holiday ID will be auto-generated if left empty
        </Alert>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6 mt-2">
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
                sx={{ marginBottom: 2 }}
              />
            </div>

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
                sx={{ marginBottom: 2 }}
              />
            </div>

            <div className="col-span-6">
              <TextField
                fullWidth
                label="Holiday ID"
                {...register("holiday_id")}
                placeholder="Auto-generated if empty"
                disabled={isSubmitting}
                sx={{ marginBottom: 2 }}
              />
            </div>

           <div className="col-span-6">
  <TextField
    select
    fullWidth
    label="Status"
    {...register("status")}
    error={!!errors.status}
    helperText={errors.status?.message}
    disabled={isSubmitting}
    defaultValue="Active"
    // Height styling for dropdown
    sx={{
      '& .MuiInputBase-root': {
        height: '56px', // Increased height
      },
      '& .MuiOutlinedInput-input': {
        padding: '14px 16px',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      },
      '& .MuiInputLabel-root': {
        fontSize: '15px',
        top: '-8px',
        '&.Mui-focused': {
          top: '0px',
        }
      }
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
            maxHeight: 400,
            '& .MuiMenuItem-root': {
              minHeight: '56px', // Larger menu items
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
              }
            }
          }
        }
      }
    }}
  >
    <MenuItem value="Active" sx={{ minHeight: '56px', fontSize: '15px' }}>
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        Active
      </span>
    </MenuItem>
    <MenuItem value="Inactive" sx={{ minHeight: '56px', fontSize: '15px' }}>
      <span className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-gray-400"></span>
        Inactive
      </span>
    </MenuItem>
  </TextField>
</div>

            <div className="col-span-12">
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                {...register("description")}
                disabled={isSubmitting}
                placeholder="Enter holiday description (optional)"
                sx={{ marginBottom: 2 }}
              />
            </div>
          </div>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3, pt: 2, borderTop: 1, borderColor: "divider" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting && <CircularProgress size={16} color="inherit" />}
              Create Holiday
            </button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHolidayModal;