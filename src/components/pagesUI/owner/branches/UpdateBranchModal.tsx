// UpdateBranchModal.tsx
"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Box,
  Chip,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import FormLabel from "@/components/elements/SharedInputs/FormLabel";
import { IBranch } from "./BranchTypes";

interface UpdateBranchModalProps {
  open: boolean;
  setOpen: (b: boolean) => void;
  editData: IBranch | null;
  onSave: (payload: Partial<IBranch>) => void;
  onUpdateSuccess?: () => void;
}

// Status options
const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Closed", label: "Closed" },
];

const UpdateBranchModal: React.FC<UpdateBranchModalProps> = ({
  open,
  setOpen,
  editData,
  onSave,
  onUpdateSuccess,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    control,
    watch,
  } = useForm<Partial<IBranch>>({
    defaultValues: {
      branchName: "",
      branchCode: "",
      country: "",
      state: "",
      city: "",
      addressLine1: "",
      addressLine2: "",
      zipCode: "",
      phone: "",
      email: "",
      managerName: "",
      managerEmail: "",
      totalEmployees: undefined,
      status: "Active",
    },
  });

  // Watch status for UI updates
  const status = watch("status");

  // Load branch data when modal opens with editData
  useEffect(() => {
    if (open && editData) {
      loadBranchData();
    }
  }, [open, editData]);

  const loadBranchData = async () => {
    if (!editData?.id) return;

    try {
      setLoading(true);
      setError(null);

      // If we already have editData, use it
      const formData = {
        branchName: editData.branch_name || editData.branchName || "",
        branchCode: editData.branch_code || editData.branchCode || "",
        country: editData.address?.country || editData.country || "",
        state: editData.address?.state || editData.state || "",
        city: editData.address?.city || editData.city || "",
        addressLine1: editData.address?.addressLine1 || editData.addressLine1 || "",
        addressLine2: editData.address?.addressLine2 || editData.addressLine2 || "",
        zipCode: editData.address?.zipCode || editData.zipCode || "",
        phone: editData.phone || "",
        email: editData.email || "",
        managerName: editData.manager_name || editData.managerName || "",
        managerEmail: editData.manager_email || "",
        totalEmployees: editData.total_employees || editData.totalEmployees || "",
        status: editData.is_active || editData.status || "Active",
      };

      reset(formData);
    } catch (err) {
      setError("Failed to load branch data");
      console.error("Error loading branch data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (isDirty) {
      if (confirm("You have unsaved changes. Are you sure you want to close?")) {
        setOpen(false);
        reset();
      }
    } else {
      setOpen(false);
      reset();
    }
  };

  const onSubmit = async (data: Partial<IBranch>) => {
    if (!editData?.id) return;

    try {
      setSubmitting(true);
      setError(null);

      // Prepare payload for API - ensure status is correct
      const statusValue = data.status as "Active" | "Inactive" | "Closed" | undefined;
      
      const payload = {
        id: editData.id,
        branch_name: data.branchName?.trim() || "",
        branch_code: data.branchCode?.trim() || "",
        phone: data.phone?.trim() || "",
        email: data.email?.trim() || "",
        manager_name: data.managerName?.trim() || "",
        manager_email: data.managerEmail?.trim() || "",
        total_employees: data.totalEmployees ? Number(data.totalEmployees) : 0,
        is_active: statusValue || "Active",
        address: {
          country: data.country?.trim() || "",
          state: data.state?.trim() || "",
          city: data.city?.trim() || "",
          addressLine1: data.addressLine1?.trim() || "",
          addressLine2: data.addressLine2?.trim() || "",
          zipCode: data.zipCode?.trim() || "",
        },
      };

      // Call API - FIXED: Use correct endpoint with ID
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/owner/branch`,
        payload,
        { withCredentials: true }
      );

      // Prepare data for parent component
      const updatedBranchData = {
        ...payload,
        branchName: payload.branch_name,
        branchCode: payload.branch_code,
        managerName: payload.manager_name,
        managerEmail: payload.manager_email,
        totalEmployees: payload.total_employees,
        status: payload.is_active,
        country: payload.address.country,
        state: payload.address.state,
        city: payload.address.city,
        addressLine1: payload.address.addressLine1,
        addressLine2: payload.address.addressLine2,
        zipCode: payload.address.zipCode,
      };

      // Call parent's onSave function to update local state
      onSave(updatedBranchData);

      toast.success("Branch updated successfully!");
      
      // Call the success callback to reload data
      if (onUpdateSuccess) {
        onUpdateSuccess();
      }
      
      // Refresh the page data
      router.refresh();
      
      // Close modal
      setOpen(false);
      reset();

    } catch (err: any) {
      const errorMessage = err.response?.data?.message ||
        err.response?.data?.error?.errorMessage ||
        "Failed to update branch";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusChip = (statusValue: string | undefined) => {
    if (!statusValue) return null;

    const statusMap: Record<string, "success" | "error" | "warning" | "default"> = {
      "Active": "success",
      "Inactive": "warning",
      "Closed": "error",
    };

    const color = statusMap[statusValue] || "default";

    return (
      <Chip
        label={statusValue}
        color={color}
        size="small"
        variant="filled"
        sx={{ ml: 1 }}
      />
    );
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="md">
        <DialogTitle>
          <div className="flex justify-between items-center">
            <h5 className="modal-title">Update Branch</h5>
            <button onClick={handleToggle} type="button" className="bd-btn-close">
              <i className="fa-solid fa-xmark-large"></i>
            </button>
          </div>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
            <Box sx={{ ml: 2 }}>
              <p>Loading branch data...</p>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="md">
      <DialogTitle>
        <div className="flex justify-between items-center">
          <div>
            <h5 className="modal-title" style={{ display: 'inline-flex', alignItems: 'center' }}>
              Update Branch
              {getStatusChip(status)}
            </h5>
            {editData?.branchCode && (
              <p className="text-sm text-gray-500 mt-1">Code: {editData.branchCode}</p>
            )}
          </div>
          <button onClick={handleToggle} type="button" className="bd-btn-close">
            <i className="fa-solid fa-xmark-large"></i>
          </button>
        </div>
      </DialogTitle>

      <DialogContent className="common-scrollbar overflow-y-auto" style={{ maxHeight: '70vh' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} id="branch-update-form">
          <div className="card__wrapper">
            <div className="grid grid-cols-12 gap-y-6 gap-x-6 maxXs:gap-x-0">

              {/* Header Info */}
              <div className="col-span-12">
                <Alert severity="info" sx={{ mb: 2 }}>
                  Editing: <strong>{editData?.branchName || editData?.branch_name || "Branch"}</strong>
                  {editData?.id && (
                    <span className="ml-2">(ID: {editData.id})</span>
                  )}
                </Alert>
              </div>

              {/* General Information */}
              <div className="col-span-12">
                <h6 className="text-lg font-semibold mb-4 border-b pb-2">
                  General Information
                </h6>
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Branch Name *"
                  id="branchName"
                  type="text"
                  register={register("branchName", { required: "Branch Name is required" })}
                  // error={errors.branchName}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Branch Code *"
                  id="branchCode"
                  type="text"
                  register={register("branchCode", { required: "Branch Code is required" })}
                  // error={errors.branchCode}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="status"
                  label="Status *"
                  options={statusOptions}
                  control={control}
                  // rules={{ required: "Status is required" }}
                  // error={errors.status}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Total Employees"
                  id="totalEmployees"
                  type="number"
                  register={register("totalEmployees", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Must be >= 0" },
                  })}
                  // error={errors.totalEmployees}
                />
              </div>

              {/* Location Information */}
              <div className="col-span-12 mt-4">
                <h6 className="text-lg font-semibold mb-4 border-b pb-2">
                  Location Information
                </h6>
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Country *"
                  id="country"
                  type="text"
                  register={register("country", { required: "Country is required" })}
                  // error={errors.country}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="State *"
                  id="state"
                  type="text"
                  register={register("state", { required: "State is required" })}
                  // error={errors.state}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="City *"
                  id="city"
                  type="text"
                  register={register("city", { required: "City is required" })}
                  // error={errors.city}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="ZIP Code *"
                  id="zipCode"
                  type="text"
                  register={register("zipCode", { required: "ZIP Code is required" })}
                  // error={errors.zipCode}
                />
              </div>

              <div className="col-span-12">
                <div className="from__input-box">
                  <FormLabel label="Address Line 1 *" id="addressLine1" />
                  <div className="form__input">
                    <textarea
                      {...register("addressLine1", { required: "Address Line 1 is required" })}
                      className="form-control"
                      id="addressLine1"
                      rows={2}
                    />
                    {/* {errors.addressLine1 && (
                      <p className="text-red-500 text-sm mt-1">{errors.addressLine1.message}</p>
                    )} */}
                  </div>
                </div>
              </div>

              <div className="col-span-12">
                <div className="from__input-box">
                  <FormLabel label="Address Line 2" id="addressLine2" />
                  <div className="form__input">
                    <textarea
                      {...register("addressLine2")}
                      className="form-control"
                      id="addressLine2"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="col-span-12 mt-4">
                <h6 className="text-lg font-semibold mb-4 border-b pb-2">
                  Contact Information
                </h6>
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Phone *"
                  id="phone"
                  type="text"
                  register={register("phone", {
                    required: "Phone is required",
                    pattern: {
                      value: /^[0-9+\-\s()]{10,}$/,
                      message: "Please enter a valid phone number"
                    }
                  })}
                  error={errors.phone}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Email *"
                  id="email"
                  type="email"
                  register={register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  error={errors.email}
                />
              </div>

              {/* Manager Information */}
              <div className="col-span-12 mt-4">
                <h6 className="text-lg font-semibold mb-4 border-b pb-2">
                  Manager Information
                </h6>
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Manager Name"
                  id="managerName"
                  type="text"
                  register={register("managerName")}
                  // error={errors.managerName}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Manager Email"
                  id="managerEmail"
                  type="email"
                  register={register("managerEmail", {
                    pattern: {
                      value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  // error={errors.managerEmail}
                />
              </div>

              {/* Last Updated Info */}
              {editData?.updated_at && (
                <div className="col-span-12 mt-4">
                  <Alert severity="info">
                    <div className="text-sm">
                      <p><strong>Last Updated:</strong> {new Date(editData.updated_at).toLocaleString()}</p>
                      {editData.created_at && (
                        <p className="mt-1"><strong>Created:</strong> {new Date(editData.created_at).toLocaleDateString()}</p>
                      )}
                    </div>
                  </Alert>
                </div>
              )}

            </div>
          </div>

          <div className="submit__btn text-center" style={{ marginTop: 16 }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Updating...
                </>
              ) : (
                "Update Branch"
              )}
            </button>
          </div>
        </form>
      </DialogContent>

      <DialogActions className="p-4 border-t">
        <Button
          onClick={handleToggle}
          variant="outlined"
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="branch-update-form"
          variant="contained"
          className="!text-white"
          color="primary"
          disabled={submitting}
        >
          {submitting ? "Updating..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateBranchModal;