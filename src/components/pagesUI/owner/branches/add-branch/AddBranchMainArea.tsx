"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Autocomplete,
  FormControlLabel,
  Switch,
  Button,
  Typography,
  Paper,
  Divider,
  Chip,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LocationOn, Phone, Delete, Cancel, Save } from "@mui/icons-material";
import axios from "axios";
import { isAuthenticated } from "@/app/helpers/authChecker";

// Types based on your IBranch interface
interface IBranchForm {
  branch_name: string;
  branch_code?: string;
  phone?: string;
  email?: string;
  manager_name?: string;
  manager_email?: string;
  total_employees?: number;
  is_active: "Active" | "Inactive" | "Closed";
  address?: {
    country?: string;
    state?: string;
    city?: string;
    addressLine1?: string;
    addressLine2?: string;
    zipCode?: string;
  };
}

// Mock data for dropdowns
const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "India",
  "China",
  "Brazil",
  "Mexico",
  "Singapore",
  "United Arab Emirates",
  "South Africa",
];

const statusOptions: Array<"Active" | "Inactive" | "Closed"> = [
  "Active",
  "Inactive",
  "Closed",
];

const AddBranchMainArea: React.FC<{
  isEdit?: boolean;
  branchId?: number;
  clientId: number; // Assuming you pass clientId from parent
}> = ({
  isEdit = false,
  branchId,
  clientId
}) => {
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(isEdit);

    const {
      control,
      handleSubmit,
      watch,
      setValue,
      reset,
      formState: { errors, isDirty },
    } = useForm<IBranchForm>({
      defaultValues: {
        branch_name: "",
        branch_code: "",
        phone: "",
        email: "",
        manager_name: "",
        manager_email: "",
        total_employees: 0,
        is_active: "Active",
        address: {
          country: "",
          state: "",
          city: "",
          addressLine1: "",
          addressLine2: "",
          zipCode: "",
        },
      },
    });

    // Load branch data for edit mode
    useEffect(() => {

      if (isEdit && branchId) {
        const fetchBranch = async () => {
          try {
            setIsLoading(true);
            const response = await fetch(`/api/branches/${branchId}`);
            if (!response.ok) throw new Error("Failed to fetch branch");

            const data = await response.json();
            reset({
              ...data,
              address: typeof data.address === 'string'
                ? JSON.parse(data.address)
                : data.address || {}
            });
          } catch (error:any) {
             if (error.response?.status === 401) {
    router.push("/");
    return;
  }
            toast.error("Failed to load branch data");
            console.error("Error fetching branch:", error);
          } finally {
            setIsLoading(false);
          }
        };
        fetchBranch();
      }
    }, [isEdit, branchId, reset]);

    useEffect(() => {
      const checkAuth = async () => {
        const isAuth = await isAuthenticated();
        if (!isAuth) {
          router.push("/");
        }
      };
      checkAuth();
    },[])

const onSubmit = async (data: IBranchForm) => {
  setIsSubmitting(true);

  try {
    const payload = {
      client_id: clientId,
      branch_name: data.branch_name,
      branch_code: data.branch_code || null,
      phone: data.phone || null,
      email: data.email || null,
      manager_name: data.manager_name || null,
      manager_email: data.manager_email || null,
      total_employees: data.total_employees || 0,
      status: data.is_active,
      address: data.address || null,
    };

    console.log("Payload to be sent:", payload);

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/owner/branch`, 
      payload,
      {
        withCredentials: true
      }
    );

    // Handle success
    console.log("Response received:", response.data);
    
    toast.success(
      isEdit
        ? "Branch updated successfully!"
        : "Branch created successfully!"
    );

    // Reset submitting state
    setIsSubmitting(false);

    // Redirect after a short delay
    setTimeout(() => {
      router.push("/owner/branches");
      router.refresh();
    }, 1000);

  } catch (error: any) {
    console.error("Error saving branch:", error);
    
    // Extract the error message properly
    let errorMessage = "Failed to save branch";

     if (error.response?.status === 401) {
    router.push("/");
    return;
  }
    
    if (error.response?.data) {
      // Check different possible formats of error response
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.data.error) {
        errorMessage = error.response.data.error;
      } else if (error.response.data.errorMessage) {
        errorMessage = error.response.data.errorMessage;
      } else {
        // If it's an object, stringify it for debugging
        errorMessage = JSON.stringify(error.response.data);
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    // Ensure it's a string
    toast.error(String(errorMessage));
    
    setIsSubmitting(false);
  }
};





    const handleCancel = () => {
      if (isDirty) {
        if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
          router.push("/owner/branches");
        }
      } else {
        router.push("/owner/branches");
      }
    };

    // Watch values
    const watchStatus = watch("is_active");

    if (isLoading) {
      return (
        <div className="app__slide-wrapper">
          <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <Typography>Loading branch data...</Typography>
          </Box>
        </div>
      );
    }

    return (
      <div className="app__slide-wrapper">
        <Box sx={{ p: 3 }}>
          {/* Breadcrumb */}
          <Box sx={{ mb: 3 }}>
            <div className="breadcrumb__wrapper mb-[25px]">
              <nav>
                <ol className="breadcrumb flex items-center mb-0">
                  <li className="breadcrumb-item">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link href="/owner">Owner</Link>
                  </li>
                  <li className="breadcrumb-item active">All Branches</li>
                </ol>
              </nav>
            </div>
          </Box>

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
                <LocationOn sx={{ fontSize: 32, color: 'primary.main' }} />
              </Box>
              <Box>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
                  {isEdit ? "Edit Branch" : "Add New Branch"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {isEdit
                    ? "Update the details of your branch"
                    : "Fill in the details below to add a new branch"}
                </Typography>
              </Box>
            </Box>

            {isEdit && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Editing branch: <strong>{watch("branch_name") || "Unnamed Branch"}</strong>
                <br />
                <small>Changes will affect all associated employees and operations.</small>
              </Alert>
            )}
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
                Branch Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter all required information for the branch
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ p: 3 }}>
                {/* Two-column layout for desktop */}
                <Grid container spacing={3}>
                  {/* Left Column - Basic Info */}
                  <Grid item xs={12} lg={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* Branch Name */}
                      <Controller
                        name="branch_name"
                        control={control}
                        rules={{ required: "Branch name is required" }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Branch Name"
                            required
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            placeholder="e.g., Headquarters, Mumbai Branch"
                          />
                        )}
                      />

                      {/* Branch Code */}
                      <Controller
                        name="branch_code"
                        control={control}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Branch Code"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            placeholder="e.g., HQ001, MUM001"
                          />
                        )}
                      />

                      {/* Phone Number */}
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Phone Number"
                            fullWidth
                            placeholder="+91 9876543210"
                            InputProps={{
                              startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
                            }}
                          />
                        )}
                      />

                      {/* Email */}
                      <Controller
                        name="email"
                        control={control}
                        rules={{
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Email"
                            type="email"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            placeholder="branch@company.com"
                          />
                        )}
                      />
                    </Box>
                  </Grid>

                  {/* Right Column - Manager & Status */}
                  <Grid item xs={12} lg={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* Manager Name */}
                      <Controller
                        name="manager_name"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Manager Name"
                            fullWidth
                            placeholder="John Doe"
                          />
                        )}
                      />

                      {/* Manager Email */}
                      <Controller
                        name="manager_email"
                        control={control}
                        rules={{
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address"
                          }
                        }}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            label="Manager Email"
                            type="email"
                            fullWidth
                            error={!!fieldState.error}
                            helperText={fieldState.error?.message}
                            placeholder="manager@company.com"
                          />
                        )}
                      />

                      {/* Total Employees */}
                      <Controller
                        name="total_employees"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Total Employees"
                            type="number"
                            fullWidth
                            inputProps={{ min: 0 }}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        )}
                      />

                      {/* Status */}
                      <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                          <Autocomplete
                            value={field.value}
                            onChange={(event, newValue) => {
                              field.onChange(newValue || "Active");
                            }}
                            options={statusOptions}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Status"
                                required
                                inputRef={field.ref}
                              />
                            )}
                            fullWidth
                          />
                        )}
                      />
                    </Box>
                  </Grid>

                  {/* Full Width - Address Section */}
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Address Information
                      </Typography>
                    </Divider>
                  </Grid>

                  <Grid item xs={12} lg={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      {/* Address Line 1 */}
                      <Controller
                        name="address.addressLine1"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Address Line 1"
                            fullWidth
                            placeholder="e.g., 123 Business Street"
                            InputProps={{
                              startAdornment: <LocationOn sx={{ mr: 1, color: 'action.active' }} />,
                            }}
                          />
                        )}
                      />

                      {/* Address Line 2 */}
                      <Controller
                        name="address.addressLine2"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Address Line 2"
                            fullWidth
                            placeholder="e.g., Near Central Mall, Suite 500"
                          />
                        )}
                      />

                      {/* City, State, Country Row */}
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Controller
                            name="address.city"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="City"
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Controller
                            name="address.state"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="State / Province"
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Controller
                            name="address.country"
                            control={control}
                            render={({ field }) => (
                              <Autocomplete
                                value={field.value}
                                onChange={(event, newValue) => {
                                  field.onChange(newValue || "");
                                }}
                                options={countries}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Country"
                                    inputRef={field.ref}
                                  />
                                )}
                                freeSolo
                                disableClearable
                                fullWidth
                              />
                            )}
                          />
                        </Grid>
                      </Grid>

                      {/* ZIP Code */}
                      <Controller
                        name="address.zipCode"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label="Postal Code / ZIP Code"
                            fullWidth
                            placeholder="e.g., 94105, 400001"
                          />
                        )}
                      />
                    </Box>
                  </Grid>

                  {/* Status Info Card */}
                  <Grid item xs={12} lg={6}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: watchStatus === 'Active' ? 'success.light' :
                            watchStatus === 'Inactive' ? 'warning.light' : 'error.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}>
                          {watchStatus === 'Active' && '✓'}
                          {watchStatus === 'Inactive' && '⚠'}
                          {watchStatus === 'Closed' && '✗'}
                        </Box>
                        <Box>
                          <Typography variant="subtitle2" gutterBottom>
                            Branch Status: <strong>{watchStatus}</strong>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {watchStatus === 'Active' && "This branch is active and operational"}
                            {watchStatus === 'Inactive' && "This branch is temporarily inactive"}
                            {watchStatus === 'Closed' && "This branch is permanently closed"}
                          </Typography>
                        </Box>
                      </Box>

                      <Alert
                        severity={
                          watchStatus === 'Active' ? 'success' :
                            watchStatus === 'Inactive' ? 'warning' : 'error'
                        }
                        sx={{ mt: 1 }}
                      >
                        <Typography variant="caption">
                          {watchStatus === 'Active' &&
                            "✓ Active branches can accept new employees and process operations."}
                          {watchStatus === 'Inactive' &&
                            "⚠ Inactive branches are hidden from listings but retain historical data."}
                          {watchStatus === 'Closed' &&
                            "✗ Closed branches cannot be reactivated. Consider archiving instead."}
                        </Typography>
                      </Alert>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                <Divider sx={{ my: 4 }} />
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2
                }}>
                  <Box>
                    {isEdit && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => setDeleteDialogOpen(true)}
                        sx={{ mr: 2 }}
                        disabled={watchStatus === 'Closed'}
                      >
                        Delete Branch
                      </Button>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
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
                      disabled={isSubmitting}
                      className="!text-white"
                    >
                      {isSubmitting ? "Saving..." : isEdit ? "Update Branch" : "Create Branch"}
                    </Button>
                  </Box>
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
                <Typography variant="h6" gutterBottom sx={{ color: 'info.dark' }}>
                  Tips for adding a new branch
                </Typography>
                <Box component="ul" sx={{ pl: 2, m: 0, color: 'info.700' }}>
                  <li>
                    <Typography variant="body2">
                      <strong>Branch Name:</strong> Use a descriptive name that employees will recognize (e.g., NYC Office, Mumbai HQ).
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <strong>Branch Code:</strong> Use a unique code for internal tracking (e.g., HQ001, MUM002).
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <strong>Status:</strong> Set to 'Inactive' for branches under construction or temporarily closed.
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      <strong>Address:</strong> Complete address helps with location-based features and reporting.
                    </Typography>
                  </li>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">
            Delete Branch
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this branch?
              <br />
              <strong>This action cannot be undone.</strong>
              <br />
              <br />
              <strong>Branch:</strong> {watch("branch_name")}
              <br />
              <strong>Status:</strong> {watchStatus}
              <br />
              <br />
              {watchStatus === 'Active' &&
                "⚠ This branch is currently active. Consider setting it to 'Inactive' instead."}
              {watchStatus === 'Closed' &&
                "This branch is already closed. Deleting will remove all historical records."}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            {/* <Button onClick={handleDelete} color="error" variant="contained">
            Delete Branch
          </Button> */}
          </DialogActions>
        </Dialog>
      </div>
    );
  };

export default AddBranchMainArea;