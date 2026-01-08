"use client";

import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import DatePicker from "react-datepicker";
import { toast } from "sonner";

import { statePropsType } from "@/interface/common.interface";
import { employeeDesignationData } from "@/data/dropdown-data";
import { IEmployee } from "./EmployeeTypes";

import InputField from "@/components/elements/SharedInputs/InputField";
import FormLabel from "@/components/elements/SharedInputs/FormLabel";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";

interface AddEmployeeModalProps extends statePropsType {
  onSave: (payload: Partial<IEmployee>) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  open,
  setOpen,
  onSave,
}) => {
  const [joiningDate, setJoiningDate] = useState<Date | null>(new Date());

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IEmployee>();

  const handleToggle = () => setOpen(false);

  const onSubmit = (data: IEmployee) => {
    const payload: IEmployee = {
      ...data,
      id: Date.now(),
      employee_id: Date.now(),
      employeeId: data.employeeID ?? "",
      image: {} as any,
      name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      joiningDate: joiningDate
        ? joiningDate.toISOString().split("T")[0]
        : undefined,
      created_at: new Date().toISOString(),
      status: "Active",
    };

    onSave(payload);
    toast.success("Employee added successfully!");
    setTimeout(() => setOpen(false), 500);
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="md">
      <DialogTitle>Add New Employee</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-6">
              <InputField
                id="first_name"
                label="First Name"
                register={register("first_name", { required: "Required" })}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="last_name"
                label="Last Name"
                register={register("last_name", { required: "Required" })}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="phone"
                label="Phone"
                register={register("phone", { required: "Required" })}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="email"
                label="Email"
                register={register("email")}
                error={errors.email}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="username"
                label="Username"
                register={register("username")}
                error={errors.username}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="employeeID"
                label="Employee ID"
                register={register("employeeID", { required: "Required" })}
              />
            </div>

            <div className="col-span-6">
              <SelectBox
                id="designation"
                label="Designation"
                options={employeeDesignationData}
                control={control}
                isRequired
              />
            </div>

            <div className="col-span-6">
              <FormLabel id="joining_date" label="Joining Date" />
              <DatePicker
                selected={joiningDate}
                onChange={setJoiningDate}
                className="w-full"
                dateFormat="dd/MM/yyyy"
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

export default AddEmployeeModal;
