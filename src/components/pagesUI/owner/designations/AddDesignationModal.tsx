"use client";

import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { IDesignation } from "./DesignationTypes";
import { statePropsType } from "@/interface/common.interface";

import InputField from "@/components/elements/SharedInputs/InputField";

interface Props extends statePropsType {
  onSave: (payload: Partial<IDesignation>) => void;
}

const AddDesignationModal: React.FC<Props> = ({ open, setOpen, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IDesignation>();

  const onSubmit = (data: IDesignation) => {
    const payload: IDesignation = {
      ...data,
      designationId: data.designationId,
      created_at: new Date().toISOString(),
      status: "Active",
      id: Date.now(),
    };

    onSave(payload);
    toast.success("Designation added successfully!");
    setTimeout(() => setOpen(false), 500);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Add New Designation</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-6">
              <InputField
                id="name"
                label="Designation Name"
                register={register("name", { required: "Required" })}
                error={errors.name}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="designationId"
                label="Designation ID"
                register={register("designationId", { required: "Required" })}
                error={errors.designationId}
              />
            </div>

            <div className="col-span-12">
              <InputField
                id="description"
                label="Description"
                register={register("description")}
              />
            </div>
          </div>

          <div className="text-center mt-6">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDesignationModal;
