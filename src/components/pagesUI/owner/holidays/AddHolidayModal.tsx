"use client";

import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { IHoliday } from "./HolidayTypes";
import { statePropsType } from "@/interface/common.interface";
import InputField from "@/components/elements/SharedInputs/InputField";

interface Props extends statePropsType {
  onSave: (payload: Partial<IHoliday>) => void;
}

const AddHolidayModal: React.FC<Props> = ({ open, setOpen, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IHoliday>();

  const onSubmit = (data: IHoliday) => {
    const payload: IHoliday = {
      ...data,
      id: Date.now(),
      holidayId: `HOL-${Date.now()}`,
      created_at: new Date().toISOString().split("T")[0],
      status: "Active",
    };

    onSave(payload);
    toast.success("Holiday added successfully!");
    setTimeout(() => setOpen(false), 500);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Add Holiday</DialogTitle>
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

            <div className="col-span-6">
              <InputField
                id="holidayId"
                label="Holiday ID"
                register={register("holidayId")}
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

export default AddHolidayModal;
