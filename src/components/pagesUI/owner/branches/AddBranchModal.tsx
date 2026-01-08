// AddBranchModal.tsx
"use client";

import React, { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import FormLabel from "@/components/elements/SharedInputs/FormLabel";

import { IBranch } from "./BranchTypes";

interface AddBranchModalProps {
  open: boolean;
  setOpen: (b: boolean) => void;
  editData?: IBranch | null;
  onSave: (payload: Partial<IBranch>) => void;
}

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
  { value: "Closed", label: "Closed" },
];

const AddBranchModal: React.FC<AddBranchModalProps> = ({
  open,
  setOpen,
  editData = null,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<IBranch>({
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
    } as Partial<IBranch>,
  });

  useEffect(() => {
    if (editData) {
      reset(editData as any);
    } else {
      reset({
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
      } as Partial<IBranch>);
    }
  }, [editData, open, reset]);

  const handleToggle = () => setOpen(!open);

  const onSubmit = (data: IBranch) => {
    try {
      // Minimal validation: branchName required
      if (!data.branchName || data.branchName.trim() === "") {
        toast.error("Branch Name is required");
        return;
      }
      onSave(data);
      toast.success(editData ? "Branch updated" : "Branch created");
      // reset handled by parent if needed
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="md">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">{editData ? "Update Branch" : "Add New Branch"}</h5>
          <button onClick={handleToggle} type="button" className="bd-btn-close">
            <i className="fa-solid fa-xmark-large"></i>
          </button>
        </div>
      </DialogTitle>

      <DialogContent className="common-scrollbar overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} id="branch-form">
          <div className="card__wrapper">
            <div className="grid grid-cols-12 gap-y-6 gap-x-6 maxXs:gap-x-0">
              {/* General */}
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Branch Name"
                  id="branchName"
                  type="text"
                  register={register("branchName", { required: "Branch Name is required" })}
                  error={errors.branchName}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Branch Code"
                  id="branchCode"
                  type="text"
                  register={register("branchCode")}
                  error={errors.branchCode}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <SelectBox
                  id="status"
                  label="Status"
                  options={statusOptions}
                  control={control}
                  error={errors.status}
                />
              </div>

              {/* Location */}
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Country"
                  id="country"
                  type="text"
                  register={register("country")}
                  error={errors.country}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="State"
                  id="state"
                  type="text"
                  register={register("state")}
                  error={errors.state}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="City"
                  id="city"
                  type="text"
                  register={register("city")}
                  error={errors.city}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="ZIP Code"
                  id="zipCode"
                  type="text"
                  register={register("zipCode")}
                  error={errors.zipCode}
                />
              </div>

              <div className="col-span-12 md:col-span-6">
                <div className="from__input-box">
                  <FormLabel label="Address Line 1" id="addressLine1" />
                  <div className="form__input">
                    <textarea
                      {...register("addressLine1")}
                      className="form-control"
                      id="addressLine1"
                      rows={2}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6">
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

              {/* Contact */}
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Phone"
                  id="phone"
                  type="text"
                  register={register("phone")}
                  error={errors.phone}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Email"
                  id="email"
                  type="email"
                  register={register("email", {
                    pattern: {
                      value:
                        // simple email regex
                        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  error={errors.email}
                />
              </div>

              {/* Manager */}
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Manager Name"
                  id="managerName"
                  type="text"
                  register={register("managerName")}
                  error={errors.managerName}
                />
              </div>
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Manager Email"
                  id="managerEmail"
                  type="email"
                  register={register("managerEmail", {
                    pattern: {
                      value:
                        /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  error={errors.managerEmail}
                />
              </div>

              {/* Other */}
              <div className="col-span-12 md:col-span-6">
                <InputField
                  label="Total Employees"
                  id="totalEmployees"
                  type="number"
                  register={register("totalEmployees", {
                    valueAsNumber: true,
                    min: { value: 0, message: "Must be >= 0" },
                  })}
                  error={errors.totalEmployees}
                />
              </div>
            </div>
          </div>

          <div className="submit__btn text-center" style={{ marginTop: 16 }}>
            <button type="submit" className="btn btn-primary">
              {editData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleToggle}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBranchModal;
