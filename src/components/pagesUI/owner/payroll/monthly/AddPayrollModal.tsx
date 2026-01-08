"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";

import { IPayroll } from "./PayrollTypes";
import { statePropsType } from "@/interface/common.interface";
import InputField from "@/components/elements/SharedInputs/InputField";

interface Props extends statePropsType {
  onSave: (payload: Partial<IPayroll>) => void;
}

const AddPayrollModal: React.FC<Props> = ({ open, setOpen, onSave }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<IPayroll>();
  
  // Watch salary components for live net salary calculation
  const basic = watch("basic") || 0;
  const hra = watch("hra") || 0;
  const allowances = watch("allowances") || 0;
  const deductions = watch("deductions") || 0;

  const [netSalary, setNetSalary] = useState(0);

  useEffect(() => {
    setNetSalary(basic + hra + allowances - deductions);
    setValue("netSalary", basic + hra + allowances - deductions);
  }, [basic, hra, allowances, deductions, setValue]);

  const onSubmit = (data: IPayroll) => {
    const payload: IPayroll = {
      ...data,
      id: Date.now(),
      status: "Pending",
    };

    onSave(payload);
    toast.success("Payroll added successfully!");
    setTimeout(() => setOpen(false), 500);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Add Payroll</DialogTitle>
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
                register={register("basic", { required: "Required", valueAsNumber: true })}
                error={errors.basic}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="hra"
                label="HRA"
                type="number"
                register={register("hra", { required: "Required", valueAsNumber: true })}
                error={errors.hra}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="allowances"
                label="Allowances"
                type="number"
                register={register("allowances", { valueAsNumber: true })}
                error={errors.allowances}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="deductions"
                label="Deductions"
                type="number"
                register={register("deductions", { valueAsNumber: true })}
                error={errors.deductions}
              />
            </div>

            <div className="col-span-12">
              <InputField
                id="netSalary"
                label="Net Salary"
                type="number"
                register={register("netSalary")}
                error={errors.netSalary}
              />
            </div>

          </div>

          <div className="text-center mt-6">
            <button className="btn btn-primary" type="submit">Submit</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPayrollModal;
