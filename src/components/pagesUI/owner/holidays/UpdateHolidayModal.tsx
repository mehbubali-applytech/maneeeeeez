"use client";

import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { IHoliday } from "./HolidayTypes";
import { statePropsType } from "@/interface/common.interface";
import InputField from "@/components/elements/SharedInputs/InputField";

interface Props extends statePropsType {
  editData: IHoliday;
  onSave: (payload: Partial<IHoliday>) => void;
}

const UpdateHolidayModal: React.FC<Props> = ({
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
  } = useForm<IHoliday>();

  useEffect(() => {
    reset(editData);
  }, [editData, reset]);

  const onSubmit = (data: IHoliday) => {
    onSave({ ...editData, ...data });
    toast.success("Holiday updated successfully!");
    setTimeout(() => setOpen(false), 500);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Update Holiday</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <InputField
                id="name"
                label="Holiday Name"
                register={register("name", { required: "Required" })}
                error={errors.name}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="date"
                label="Date"
                type="date"
                register={register("date", { required: "Required" })}
                error={errors.date}
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

export default UpdateHolidayModal;
