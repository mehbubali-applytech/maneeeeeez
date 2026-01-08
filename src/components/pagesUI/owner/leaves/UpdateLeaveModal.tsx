"use client";

import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ILeave } from "./LeaveTypes";
import { statePropsType } from "@/interface/common.interface";
import InputField from "@/components/elements/SharedInputs/InputField";

interface Props extends statePropsType {
  editData: ILeave;
  onSave: (payload: Partial<ILeave>) => void;
}

const UpdateLeaveModal: React.FC<Props> = ({
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
  } = useForm<ILeave>();

  useEffect(() => {
    reset(editData);
  }, [editData, reset]);

  const onSubmit = (data: ILeave) => {
    onSave({ ...editData, ...data });
    toast.success("Leave updated successfully!");
    setTimeout(() => setOpen(false), 500);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Update Leave</DialogTitle>
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
                register={register("leaveType")}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="fromDate"
                label="From Date"
                type="date"
                register={register("fromDate")}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="toDate"
                label="To Date"
                type="date"
                register={register("toDate")}
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
              Update
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateLeaveModal;
