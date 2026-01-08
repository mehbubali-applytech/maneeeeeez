"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { IPayroll } from "./PayrollTypes";
import { statePropsType } from "@/interface/common.interface";
import InputField from "@/components/elements/SharedInputs/InputField";

interface Props extends statePropsType {
  editData: IPayroll;
  onSave: (payload: Partial<IPayroll>) => void;
}

const UpdatePayrollModal: React.FC<Props> = ({
  open,
  setOpen,
  editData,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<IPayroll>();

  const basic = watch("basic") || 0;
  const hra = watch("hra") || 0;
  const allowances = watch("allowances") || 0;
  const deductions = watch("deductions") || 0;

  const [netSalary, setNetSalary] = useState(0);

  useEffect(() => {
    reset(editData);
    setNetSalary(editData.netSalary);
  }, [editData, reset]);

  useEffect(() => {
    const calculatedNet = basic + hra + allowances - deductions;
    setNetSalary(calculatedNet);
    setValue("netSalary", calculatedNet);
  }, [basic, hra, allowances, deductions, setValue]);

  const onSubmit = (data: IPayroll) => {
    onSave({
      ...editData,
      ...data,
      netSalary,
    });

    toast.success("Payroll updated successfully!");
    setTimeout(() => setOpen(false), 500);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Update Payroll</DialogTitle>
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

            <div className="col-span-12">
              <InputField
                id="month"
                label="Month"
                type="month"
                register={register("month", { required: "Required" })}
                error={errors.month}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="basic"
                label="Basic Salary"
                type="number"
                register={register("basic", { valueAsNumber: true })}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="hra"
                label="HRA"
                type="number"
                register={register("hra", { valueAsNumber: true })}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="allowances"
                label="Allowances"
                type="number"
                register={register("allowances", { valueAsNumber: true })}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="deductions"
                label="Deductions"
                type="number"
                register={register("deductions", { valueAsNumber: true })}
              />
            </div>

            {/* Net Salary (Read-Only, No InputField) */}
            <div className="col-span-12">
              <label className="block mb-1 font-medium">Net Salary</label>
              <input
                type="number"
                value={netSalary}
                readOnly
                className="w-full border p-2 rounded bg-gray-100"
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

export default UpdatePayrollModal;
