"use client";
import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import BoxStepWithIcon, {
  StepItem,
} from "@/components/elements/advanced-ui/steps/BoxStepWithIcon";

import { ICompany } from "./companies.interface";
import { countriesData } from "@/data/country-data";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  editData?: ICompany | null;
}

const steps: StepItem[] = [
  {
    step: 1,
    title: "Company Info",
    icon: "fa-solid fa-building",
  },
  {
    step: 2,
    title: "Contact Details",
    icon: "fa-solid fa-address-book",
  },
  {
    step: 3,
    title: "Additional Info",
    icon: "fa-solid fa-layer-group",
  },
];

const UpdateCompanyDetailsModal: React.FC<Props> = ({
  open,
  setOpen,
  editData,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ICompany>();

  useEffect(() => {
    if (editData) {
      reset(editData);
    }
  }, [editData, reset]);

  const handleClose = () => setOpen(false);

  const onSubmit = async (data: ICompany) => {
    try {
      console.log("Updated Company:", data);
      toast.success("Company updated successfully");
      setTimeout(() => setOpen(false), 800);
    } catch {
      toast.error("Failed to update company");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle>
        <div className="flex justify-between items-center">
          <h5 className="modal-title">Update Company</h5>
          <button onClick={handleClose} className="bd-btn-close">✕</button>
        </div>
      </DialogTitle>

      <DialogContent>
        <BoxStepWithIcon
          steps={steps}
          currentStep={currentStep}
          onStepChange={setCurrentStep}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6">

          {/* ========== STEP 1: COMPANY INFO ========== */}
          {currentStep === 1 && (
            <div className="grid grid-cols-12 gap-4">
              
              <div className="col-span-6">
                <InputField
                  id="name"
                  label="Company Name"
                  register={register("name", { required: true })}
                  error={errors.name}
                />
              </div>

              <div className="col-span-6">
                <SelectBox
                  id="industry"
                  label="Industry"
                  control={control}
                  options={[
                    { label: "IT", value: "IT" },
                    { label: "Finance", value: "Finance" },
                    { label: "Retail", value: "Retail" },
                  ]}
                />
              </div>

              <div className="col-span-12">
                <InputField
                  id="address"
                  label="Address"
                  register={register("address")}
                  error={errors.address}
                />
              </div>

              <div className="col-span-4">
                <InputField
                  id="city"
                  label="City"
                  register={register("city")}
                />
              </div>

              <div className="col-span-4">
                <InputField
                  id="state"
                  label="State"
                  register={register("state")}
                />
              </div>

              <div className="col-span-4">
                <InputField
                  id="zipCode"
                  label="Zip Code"
                  register={register("zipCode")}
                />
              </div>

              <div className="col-span-6">
                <SelectBox
                  id="country"
                  label="Country"
                  control={control}
                  options={countriesData}
                />
              </div>

              <div className="col-span-6">
                <InputField
                  id="location"
                  label="Location"
                  register={register("location")}
                />
              </div>
            </div>
          )}

          {/* ========== STEP 2: CONTACT DETAILS ========== */}
          {currentStep === 2 && (
            <div className="grid grid-cols-12 gap-4">

              <div className="col-span-6">
                <InputField
                  id="email"
                  label="Email"
                  register={register("email", { required: true })}
                  error={errors.email}
                />
              </div>

              <div className="col-span-6">
                <InputField
                  id="owner"
                  label="Owner Name"
                  register={register("owner", { required: true })}
                  error={errors.owner}
                />
              </div>

              <div className="col-span-4">
                <InputField id="phone" label="Phone" register={register("phone")} />
              </div>

              <div className="col-span-4">
                <InputField id="mobile" label="Mobile" register={register("mobile")} />
              </div>

              <div className="col-span-4">
                <InputField id="fax" label="Fax" register={register("fax")} />
              </div>

              <div className="col-span-12">
                <InputField
                  id="websites"
                  label="Website URL"
                  register={register("websites")}
                />
              </div>
            </div>
          )}

          {/* ========== STEP 3: ADDITIONAL INFO ========== */}
          {currentStep === 3 && (
            <div className="grid grid-cols-12 gap-4">

              <div className="col-span-6">
                <InputField
                  id="tag"
                  label="Tag"
                  register={register("tag")}
                />
              </div>

              <div className="col-span-6">
                <InputField
                  id="currencyType"
                  label="Currency"
                  register={register("currencyType")}
                />
              </div>

              <div className="col-span-12">
                <InputField
                  id="description"
                  label="Description"
                  register={register("description")}
                />
              </div>

              <div className="col-span-6">
                <SelectBox
                  id="status"
                  label="Status"
                  control={control}
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                    { label: "Pending", value: "Pending" },
                  ]}
                  isRequired
                />
              </div>

              <div className="col-span-6">
                <InputField
                  id="rating"
                  label="Rating"
                  register={register("rating")}
                />
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setCurrentStep((s) => s - 1)}
              >
                Back
              </button>
            )}

            {currentStep < steps.length ? (
              <button
                type="button"
                className="btn btn-primary ml-auto"
                onClick={() => setCurrentStep((s) => s + 1)}
              >
                Next
              </button>
            ) : (
              <button type="submit" className="btn btn-success ml-auto">
                Update Company
              </button>
            )}
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCompanyDetailsModal;
