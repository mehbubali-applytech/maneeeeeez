"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  FormControlLabel,
  Switch,
  TextField,
  IconButton,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Alert,
  Divider,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

import { DepartmentFormData, SubDepartmentFormData } from "../DepartmentTypes";
import { isAuthenticated } from "@/app/helpers/authChecker";

const AddDeptMainArea = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubDepartments, setHasSubDepartments] = useState<boolean>(false);
  const [status, setStatus] = useState<boolean>(true); // Separate state for parent status

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<DepartmentFormData>({
    defaultValues: {
      dept_name: "",
      status: "1",
      is_parent: 0,
      sub_departments: [{ dept_name: "", status: "1" }],
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        router.push("/");
      }
    };
    checkAuth();
  }, [])

  const { fields, append, remove } = useFieldArray({
    control,
    name: "sub_departments",
  });

  const handleParentStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked;
    setStatus(newStatus);
    setValue("status", newStatus ? "1" : "0");
  };

  const addSubDepartment = () => {
    append({ dept_name: "", status: "1" });
  };

  const removeSubDepartment = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      setIsSubmitting(true);

      // Filter out empty sub-departments
      const validSubDepartments = hasSubDepartments
        ? data.sub_departments?.filter(
          (sd) => sd.dept_name && sd.dept_name.trim() !== ""
        ) || []
        : [];

      const payload = {
        dept_name: data.dept_name,
        status: status ? "1" : "0", // Use the state value
        sub_departments: validSubDepartments,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/department`,
        payload,
        {
          withCredentials: true,
        }
      );

      if (response.status === 201) {
        toast.success("Department created successfully!");
        setTimeout(() => {
          router.push("/owner/departments");
        }, 500);
      } else {
        throw new Error(
          response.data.message || "Failed to create department"
        );
      }
    } catch (error: any) {

      if (error.response?.status === 401) {
        router.push("/");
        return;
      }
      console.error("Error creating department:", error);

      let errorMessage = "Failed to create department";
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
              <Link href="/owner/departments">Departments</Link>
            </li>
            <li className="breadcrumb-item active">Add Department</li>
          </ol>
        </nav>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Add New Department
        </h1>
        <p className="text-gray-600 mt-2">
          Create a new department with optional sub-departments
        </p>
      </div>

      {/* Form Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={3}>
              {/* Main Department Section */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ color: "primary.main" }}>
                  Main Department
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department Name"
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
              </Grid>

              <Grid item xs={12} md={6}>
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
              </Grid>

              {/* Sub-Departments Section */}
              <Grid item xs={12}>
                <Box sx={{ mt: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" sx={{ color: "primary.main" }}>
                      Sub-Departments
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Add sub-departments?
                      </Typography>
                      <Switch
                        checked={hasSubDepartments}
                        onChange={(e) => setHasSubDepartments(e.target.checked)}
                        color="primary"
                        disabled={isSubmitting}
                      />
                    </Box>
                  </Box>
                  <Divider sx={{ mb: 3 }} />

                  {hasSubDepartments && (
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
                          {fields.map((field, index) => (
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
                                <Controller
                                  name={`sub_departments.${index}.status`}
                                  control={control}
                                  defaultValue="1"
                                  render={({ field }) => (
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={field.value === "1"}
                                          onChange={(e) =>
                                            field.onChange(e.target.checked ? "1" : "0")
                                          }
                                          size="small"
                                          color="primary"
                                          disabled={isSubmitting}
                                        />
                                      }
                                      label={
                                        <Typography variant="body2">
                                          {field.value === "1" ? "Active" : "Inactive"}
                                        </Typography>
                                      }
                                    />
                                  )}
                                />

                              </TableCell>
                              <TableCell align="center">
                                <IconButton
                                  size="small"
                                  onClick={() => removeSubDepartment(index)}
                                  disabled={fields.length <= 1 || isSubmitting}
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
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
                          {fields.length} sub-department(s) added
                        </Typography>
                      </Box>
                    </TableContainer>
                  )}

                  {!hasSubDepartments && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      No sub-departments will be created. You can enable this
                      option if needed.
                    </Alert>
                  )}
                </Box>
              </Grid>
              {/* Preview Section */}
              <Grid item xs={12}>
                <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Preview Structure:
                  </Typography>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2">
                      • {watch("dept_name") || "Main Department"}
                      <Box component="span" sx={{ ml: 1 }}>
                        <Chip
                          label={status ? "Active" : "Inactive"}
                          size="small"
                          color={status ? "success" : "default"}
                          variant="outlined"
                        />
                      </Box>
                      {hasSubDepartments && (
                        <Box component="ul" sx={{ ml: 3, mt: 1 }}>
                          {fields.map((field, index) => {
                            const subDeptStatus = watch(`sub_departments.${index}.status`) === "1";
                            return (
                              <li key={index}>
                                {watch(`sub_departments.${index}.dept_name`) ||
                                  `Sub-department ${index + 1}`}
                                <Chip
                                  label={subDeptStatus ? "Active" : "Inactive"}
                                  size="small"
                                  color={subDeptStatus ? "success" : "default"}
                                  sx={{ ml: 1 }}
                                />
                              </li>
                            );
                          })}
                        </Box>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
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
                    onClick={() => router.push("/owner/departments")}
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
                        <Box
                          component="span"
                          sx={{
                            width: 16,
                            height: 16,
                            border: "2px solid",
                            borderColor: "white transparent transparent transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                            "@keyframes spin": {
                              "0%": { transform: "rotate(0deg)" },
                              "100%": { transform: "rotate(360deg)" },
                            },
                          }}
                        />
                      ) : null
                    }
                  >
                    {isSubmitting ? "Creating..." : "Create Department"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Alert severity="info" icon={false} sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          💡 Tips for creating departments:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li>Department names should be clear and descriptive</li>
          <li>You can add multiple sub-departments under a main department</li>
          <li>Sub-departments inherit the client ID from the main department</li>
          <li>You can update department structure at any time</li>
        </ul>
      </Alert>
    </div>
  );
};

export default AddDeptMainArea;