"use client";
import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import InputField from "@/components/elements/SharedInputs/InputField";
import { toast } from "sonner";
import { IComplianceOfficer } from "./compliance-officers.interface";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  editData: IComplianceOfficer | null;
  onUpdate: (data: IComplianceOfficer) => void;
}

const UpdateComplianceOfficerModal: React.FC<Props> = ({
  open,
  setOpen,
  editData,
  onUpdate,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IComplianceOfficer>();

  /* Prefill form on edit */
  useEffect(() => {
    if (editData) {
      reset(editData);
    }
  }, [editData, reset]);

  const handleToggle = () => setOpen(!open);

  const onSubmit = async (data: IComplianceOfficer) => {
    try {
      onUpdate(data);
      toast.success("Compliance Officer updated successfully ✅");
      setTimeout(() => setOpen(false), 1000);
    } catch {
      toast.error("Failed to update Compliance Officer ❌");
    }
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="sm">
      <DialogTitle>
        <div className="flex justify-between items-center">
          <h5 className="modal-title">Update Compliance Officer</h5>
          <button onClick={handleToggle} type="button" className="bd-btn-close">
            ✕
          </button>
        </div>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            {/* Compliance Officer Name */}
            <div className="col-span-12">
              <InputField
                id="compName"
                label="Compliance Officer Name"
                register={register("compName", {
                  required: "Name is required",
                })}
              />
            </div>

            {/* Compliance Code */}
            <div className="col-span-12">
              <InputField
                id="compCode"
                label="Compliance Code"
                register={register("compCode", {
                  required: "Code is required",
                })}
              />
            </div>

            {/* Company */}
            <div className="col-span-12">
              <InputField
                id="company"
                label="Company"
                register={register("company", {
                  required: "Company is required",
                })}
                error={errors.company}
              />
            </div>

            {/* Department */}
            <div className="col-span-12">
              <InputField
                id="department"
                label="Department"
                register={register("department", {
                  required: "Department is required",
                })}
                error={errors.department}
              />
            </div>
          </div>

          <div className="text-center mt-4">
            <button className="btn btn-primary" type="submit">
              Update
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateComplianceOfficerModal;
