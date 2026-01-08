"use client";

import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ILeave } from "./LeaveTypes";
import { statePropsType } from "@/interface/common.interface";
import InputField from "@/components/elements/SharedInputs/InputField";

interface Props extends statePropsType {
  onSave: (payload: Partial<ILeave>) => void;
}

const AddLeaveModal: React.FC<Props> = ({ open, setOpen, onSave }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILeave>();

  const onSubmit = (data: ILeave) => {
    const payload: ILeave = {
      ...data,
      id: Date.now(),
      leaveId: `LV-${Date.now()}`,
      appliedOn: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    onSave(payload);
    toast.success("Leave applied successfully!");
    setTimeout(() => setOpen(false), 500);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Apply Leave</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12">
              <InputField
                id="employeeName"
                label="Employee Name"
                register={register("employeeName", { required: "Required" })}
                error={errors.employeeName}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="leaveType"
                label="Leave Type"
                register={register("leaveType", { required: "Required" })}
                error={errors.leaveType}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="fromDate"
                label="From Date"
                type="date"
                register={register("fromDate", { required: "Required" })}
                error={errors.fromDate}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="toDate"
                label="To Date"
                type="date"
                register={register("toDate", { required: "Required" })}
                error={errors.toDate}
              />
            </div>

            <div className="col-span-12">
              <InputField
                id="reason"
                label="Reason"
                register={register("reason")}
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

export default AddLeaveModal;
