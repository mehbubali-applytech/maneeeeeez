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
import axios from "axios";

import { DesignationFormData } from "./DesignationTypes";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSave: (payload: any) => void;
}

const AddDesignationModal: React.FC<Props> = ({ open, setOpen, onSave }) => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<DesignationFormData>();

  // Fetch departments on modal open
  useEffect(() => {
    if (open) {
      fetchDepartments();
      reset({
        department_id: 0,
        designation_name: "",
        designation_code: "",
        description: "",
      });
    }
  }, [open, reset]);

  const fetchDepartments = async () => {
    try {
      setIsLoadingDepartments(true);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/department`,
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.data) {
        // Flatten department tree if needed
        const flattenDepartments = (depts: any[]): any[] => {
          let result: any[] = [];
          depts.forEach(dept => {
            result.push({
              dept_id: dept.dept_id,
              dept_name: dept.dept_name,
              level: 0,
            });
            if (dept.children && dept.children.length > 0) {
              dept.children.forEach((child: any) => {
                result.push({
                  dept_id: child.dept_id,
                  dept_name: `↳ ${child.dept_name}`,
                  level: 1,
                });
              });
            }
          });
          return result;
        };

        setDepartments(flattenDepartments(response.data.data));
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
      toast.error("Failed to load departments");
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  const onSubmit = async (data: DesignationFormData) => {
    if (!data.department_id || data.department_id === 0) {
      toast.error("Please select a department");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        department_id: data.department_id,
        designation_name: data.designation_name,
        designation_code: data.designation_code,
        description: data.description || "",
      };

      await onSave(payload);
      toast.success("Designation added successfully!");
      setOpen(false);
    } catch (error: any) {
      console.error("Error adding designation:", error);
      // Error handling is done in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => !isSubmitting && setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Add New Designation</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6 mt-2">
            <div className="col-span-6">
             <TextField
  select
  fullWidth
  label="Department *"
  {...register("department_id", { 
    required: "Department is required",
    validate: value => value !== 0 || "Please select a department"
  })}
  error={!!errors.department_id}
  helperText={errors.department_id?.message}
  disabled={isLoadingDepartments || isSubmitting}
  // Add height styling
  sx={{
    '& .MuiInputBase-root': {
      height: '48px', // Increased height
    },
    '& .MuiOutlinedInput-input': {
      padding: '12px 14px', // Increased padding
    }
  }}
  InputProps={{
    sx: {
      '& .MuiSelect-select': {
        minHeight: '48px !important', // Ensure minimum height
        display: 'flex',
        alignItems: 'center',
      }
    }
  }}
  SelectProps={{
    MenuProps: {
      PaperProps: {
        sx: {
          maxHeight: 300,
          '& .MuiMenuItem-root': {
            minHeight: '48px', // Increased menu item height
            display: 'flex',
            alignItems: 'center',
          }
        }
      }
    }
  }}
>
  <MenuItem value={0} sx={{ minHeight: '48px' }}>
    {isLoadingDepartments ? "Loading departments..." : "Select Department"}
  </MenuItem>
  {departments.map((dept) => (
    <MenuItem 
      key={dept.dept_id} 
      value={dept.dept_id}
      sx={{ 
        minHeight: '48px',
        paddingLeft: dept.level > 0 ? `${dept.level * 20}px` : '16px',
        fontWeight: dept.level === 0 ? 600 : 400,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {dept.dept_name}
    </MenuItem>
  ))}
</TextField>
            </div>

            <div className="col-span-6">
              <TextField
                fullWidth
                label="Designation Name *"
                {...register("designation_name", { 
                  required: "Designation name is required",
                  minLength: {
                    value: 2,
                    message: "Designation name must be at least 2 characters"
                  }
                })}
                error={!!errors.designation_name}
                helperText={errors.designation_name?.message}
                disabled={isSubmitting}
              />
            </div>

            <div className="col-span-6">
              <TextField
                fullWidth
                label="Designation Code *"
                {...register("designation_code", { 
                  required: "Designation code is required",
                  minLength: {
                    value: 2,
                    message: "Designation code must be at least 2 characters"
                  }
                })}
                error={!!errors.designation_code}
                helperText={errors.designation_code?.message}
                disabled={isSubmitting}
              />
            </div>

            <div className="col-span-12">
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                {...register("description")}
                disabled={isSubmitting}
                placeholder="Enter designation description (optional)"
              />
            </div>

            <div className="col-span-12">
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>Tip:</strong> Designation code should be unique and easily identifiable.
              </Alert>
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
              Create Designation
            </button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDesignationModal;