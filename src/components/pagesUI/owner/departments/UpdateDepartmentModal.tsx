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
  TextField,
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { IDepartment, ExtendedSubDepartmentFormData, ExtendedDepartmentFormData } from "./DepartmentTypes";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editData: IDepartment | null;
  onSave: (payload: Partial<IDepartment>) => void;
}

const UpdateDepartmentModal: React.FC<Props> = ({
  open,
  setOpen,
  editData,
  onSave,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [existingSubDepartments, setExistingSubDepartments] = useState<IDepartment[]>([]);
  const [removedSubDeptIds, setRemovedSubDeptIds] = useState<number[]>([]);
  const [status, setStatus] = useState<boolean>(true); // Separate state for parent status

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ExtendedDepartmentFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sub_departments",
  });

  const watchStatus = watch("status");

  useEffect(() => {
    if (editData) {
      const initialStatus = editData.status === "1";
      setStatus(initialStatus);
      
      reset({
        dept_name: editData.dept_name,
        status: editData.status,
        sub_departments: [],
      });

      // Fetch existing sub-departments
      if (editData.is_parent === 1) {
        fetchSubDepartments(editData.dept_id);
      }
    }
  }, [editData, reset]);

  const fetchSubDepartments = async (parentId: number) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/department/${parentId}`,
        {
          withCredentials: true,
        }
      );
      
      if (response.data.data.children) {
        setExistingSubDepartments(response.data.data.children);
        
        // Initialize form with existing sub-departments
        const initialSubDepts: ExtendedSubDepartmentFormData[] = response.data.data.children.map((child: any) => ({
          dept_id: child.dept_id,
          dept_name: child.dept_name,
          status: child.status,
        }));
        
        reset({
          dept_name: editData?.dept_name,
          status: editData?.status,
          sub_departments: initialSubDepts,
        });
      }
    } catch (error) {
      console.error("Error fetching sub-departments:", error);
    }
  };

  const handleParentStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked;
    setStatus(newStatus);
    setValue("status", newStatus ? "1" : "0");
  };

  const addSubDepartment = () => {
    append({ dept_name: "", status: "1" });
  };

  const removeSubDepartment = (index: number) => {
    const field = fields[index] as ExtendedSubDepartmentFormData;
    // If it's an existing sub-department, add to removed list
    if (field.dept_id) {
      setRemovedSubDeptIds(prev => [...prev, field.dept_id!]);
    }
    remove(index);
  };

  const onSubmit = async (data: ExtendedDepartmentFormData) => {
    if (!editData) return;

    setIsSubmitting(true);

    try {
      const subDepartments = (data.sub_departments || []).map(sd => ({
        dept_name: sd.dept_name,
        status: sd.status || "1",
        dept_id: sd.dept_id, // Will be undefined for new ones
      }));

      const payload = {
        dept_id: editData.dept_id,
        dept_name: data.dept_name,
        status: status ? "1" : "0", // Use the state value
        sub_departments: subDepartments,
        removed_sub_dept_ids: removedSubDeptIds,
      };

      // Call API to update on server
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/department`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state
      const updatedData = {
        ...editData,
        ...payload,
        statusText: status ? "Active" : "Inactive",
        departmentName: data.dept_name,
        is_parent: subDepartments.length > 0 ? 1 : 0,
      };

      onSave(updatedData);
      toast.success("Department updated successfully!");
      setOpen(false);
      setRemovedSubDeptIds([]);

    } catch (error: any) {
      console.error("Error updating department:", error);

      let errorMessage = "Failed to update department";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
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

  const hasSubDepartments = fields.length > 0;

  return (
    <Dialog open={open} onClose={() => !isSubmitting && setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle>Update Department</DialogTitle>
      <DialogContent>
        {editData && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Updating: <strong>{editData.dept_name}</strong>
            {editData.is_parent === 1 && (
              <Chip
                label="Parent Department"
                size="small"
                color="primary"
                sx={{ ml: 2 }}
              />
            )}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            {/* Main Department */}
            <div className="col-span-12 md:col-span-6">
              <div className="mb-4">
                <TextField
                  fullWidth
                  label="Department Name *"
                  {...register("dept_name", {
                    required: "Department name is required",
                    minLength: {
                      value: 2,
                      message: "Department name must be at least 2 characters",
                    },
                  })}
                  error={!!errors.dept_name}
                  helperText={errors.dept_name?.message}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box>
                  <Typography variant="body1" fontWeight="medium">
                    Status
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {status ? "Active" : "Inactive"}
                  </Typography>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={status}
                      onChange={handleParentStatusChange}
                      color="primary"
                      disabled={isSubmitting}
                    />
                  }
                  label=""
                />
              </Box>
            </div>

            {/* Sub-Departments Section */}
            {editData?.is_parent === 1 && (
              <div className="col-span-12">
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
                    Sub-Departments
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: "action.hover" }}>
                          <TableCell width="60%">
                            <Typography variant="subtitle2">
                              Sub-Department Name
                            </Typography>
                          </TableCell>
                          <TableCell width="30%">
                            <Typography variant="subtitle2">Status</Typography>
                          </TableCell>
                          <TableCell width="10%" align="center">
                            <Typography variant="subtitle2">Actions</Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {fields.map((field: any, index) => {
                          const currentField = field as ExtendedSubDepartmentFormData;
                          return (
                            <TableRow key={field.id}>
                              <TableCell>
                                <TextField
                                  fullWidth
                                  size="small"
                                  placeholder="Enter sub-department name"
                                  {...register(`sub_departments.${index}.dept_name` as const)}
                                  disabled={isSubmitting}
                                />
                              </TableCell>
                              <TableCell>
                                <FormControlLabel
                                  control={
                                    <Switch
                                      {...register(`sub_departments.${index}.status` as const)}
                                      defaultChecked={
                                        watch(`sub_departments.${index}.status`) === "1"
                                      }
                                      size="small"
                                      color="primary"
                                    />
                                  }
                                  label={
                                    <Typography variant="body2">
                                      {watch(`sub_departments.${index}.status`) === "1"
                                        ? "Active"
                                        : "Inactive"}
                                    </Typography>
                                  }
                                />
                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  onClick={() => removeSubDepartment(index)}
                                  disabled={isSubmitting}
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
                      <Button
                        startIcon={<AddIcon />}
                        onClick={addSubDepartment}
                        disabled={isSubmitting}
                        variant="outlined"
                        size="small"
                      >
                        Add Sub-Department
                      </Button>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ ml: 2 }}
                      >
                        {fields.length} sub-department(s)
                      </Typography>
                    </Box>
                  </TableContainer>
                </Box>
              </div>
            )}

            {/* Preview Section */}
            <div className="col-span-12">
              <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Preview Structure:
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2">
                    • {watch("dept_name") || "Main Department"}
                    {hasSubDepartments && (
                      <Box component="ul" sx={{ ml: 3, mt: 1 }}>
                        {fields.map((field: any, index) => {
                          const currentField = field as ExtendedSubDepartmentFormData;
                          return (
                            <li key={index}>
                              {watch(`sub_departments.${index}.dept_name`) ||
                                `Sub-department ${index + 1}`}
                              <Chip
                                label={
                                  watch(`sub_departments.${index}.status`) === "1"
                                    ? "Active"
                                    : "Inactive"
                                }
                                size="small"
                                color={
                                  watch(`sub_departments.${index}.status`) === "1"
                                    ? "success"
                                    : "default"
                                }
                                sx={{ ml: 1 }}
                              />
                              {currentField.dept_id && (
                                <Chip
                                  label="Existing"
                                  size="small"
                                  variant="outlined"
                                  sx={{ ml: 1 }}
                                />
                              )}
                            </li>
                          );
                        })}
                      </Box>
                    )}
                  </Typography>
                </Box>
              </Box>
            </div>

            {/* Action Buttons */}
            <div className="col-span-12">
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 3,
                  pt: 2,
                  borderTop: 1,
                  borderColor: "divider",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    setOpen(false);
                    setRemovedSubDeptIds([]);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  className="!text-white"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : null
                  }
                >
                  {isSubmitting ? "Updating..." : "Update Department"}
                </Button>
              </Box>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDepartmentModal;