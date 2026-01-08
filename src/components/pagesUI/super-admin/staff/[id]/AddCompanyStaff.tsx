"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import InputField from "@/components/elements/SharedInputs/InputField";
import { toast } from "sonner";
import { statePropsType } from "@/interface/common.interface";
import { IStaff } from "../staff.interface";

const AddCompanyStaff = ({ open, setOpen }: statePropsType) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IStaff>({
    defaultValues: {
      firstName: "",
      lastName: "",
      employeeId: "",
      email: "",
      phone: "",
      department: "",
      company: "",
      position: "",
      location: "",
      joinDate: "",
      status: "Active",
      employmentType: "Full-time",
      salary: 0,
      currency: "INR",
    },
  });

  const handleToggle = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: IStaff) => {
    try {
      console.log("Staff Payload:", data);
      toast.success("Staff added successfully! 🎉");
      setTimeout(() => handleToggle(), 1200);
    } catch {
      toast.error("Failed to add staff. Please try again.");
    }
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="sm">
      <DialogTitle>
        <div className="flex justify-between items-center">
          <h5>Add New Staff</h5>
          <button onClick={handleToggle} className="bd-btn-close">
            ✕
          </button>
        </div>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card__wrapper grid grid-cols-12 gap-4">

            {/* First Name */}
            <div className="col-span-6">
              <InputField
                id="firstName"
                label="First Name"
                register={register("firstName", {
                  required: "First name is required",
                })}
                error={errors.firstName}
              />
            </div>

            {/* Last Name */}
            <div className="col-span-6">
              <InputField
                id="lastName"
                label="Last Name"
                register={register("lastName", {
                  required: "Last name is required",
                })}
                error={errors.lastName}
              />
            </div>

            {/* Employee ID */}
            <div className="col-span-12">
              <InputField
                id="employeeId"
                label="Employee ID"
                register={register("employeeId", {
                  required: "Employee ID is required",
                })}
                error={errors.employeeId}
              />
            </div>

            {/* Email */}
            <div className="col-span-12">
              <InputField
                id="email"
                label="Email"
                register={register("email", {
                  required: "Email is required",
                })}
                error={errors.email}
              />
            </div>

            {/* Phone */}
            <div className="col-span-12">
              <InputField
                id="phone"
                label="Phone"
                register={register("phone", {
                  required: "Phone is required",
                })}
                error={errors.phone}
              />
            </div>

            {/* Department */}
            <div className="col-span-6">
              <InputField
                id="department"
                label="Department"
                register={register("department", {
                  required: "Department is required",
                })}
                error={errors.department}
              />
            </div>

            {/* Company */}
            <div className="col-span-6">
              <InputField
                id="company"
                label="Company"
                register={register("company", {
                  required: "Company is required",
                })}
                error={errors.company}
              />
            </div>

          </div>

          <div className="submit__btn text-center mt-4">
            <button className="btn btn-primary" type="submit">
              Submit
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompanyStaff;
