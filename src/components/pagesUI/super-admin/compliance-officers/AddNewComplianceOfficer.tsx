"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import InputField from "@/components/elements/SharedInputs/InputField";
import { toast } from "sonner";
import { statePropsType } from "@/interface/common.interface";
import { IComplianceOfficer } from "../compliance-officers/compliance-officers.interface";

const AddNewComplianceOfficerModal = ({ open, setOpen }: statePropsType) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IComplianceOfficer>();

  const handleToggle = () => setOpen(!open);

  const onSubmit = async (data: IComplianceOfficer) => {
    try {
      console.log("Compliance Officer Payload:", data);
      toast.success("Compliance Officer added successfully! 🎉");
      setTimeout(() => setOpen(false), 1500);
    } catch {
      toast.error("Failed to add Compliance Officer.");
    }
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="sm">
      <DialogTitle>
        <div className="flex justify-between">
          <h5 className="modal-title">Add Compliance Officer</h5>
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
              Submit
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewComplianceOfficerModal;
