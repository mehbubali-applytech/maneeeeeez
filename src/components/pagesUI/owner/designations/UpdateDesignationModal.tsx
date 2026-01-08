"use client";

import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { IDesignation } from "./DesignationTypes";
import { statePropsType } from "@/interface/common.interface";

import InputField from "@/components/elements/SharedInputs/InputField";

interface Props extends statePropsType {
  editData: IDesignation;
  onSave: (payload: Partial<IDesignation>) => void;
}

const UpdateDesignationModal: React.FC<Props> = ({
  open,
  setOpen,
  editData,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IDesignation>();

  useEffect(() => {
    reset(editData);
  }, [editData, reset]);

  const onSubmit = (data: IDesignation) => {
    onSave({ ...editData, ...data });
    toast.success("Designation updated successfully!");
    setTimeout(() => setOpen(false), 500);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Update Designation</DialogTitle>
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
                register={register("designationId")}
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
              Update
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDesignationModal;
