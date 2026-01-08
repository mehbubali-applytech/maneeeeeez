"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import InputField from "@/components/elements/SharedInputs/InputField";
import { toast } from "sonner";
import { IEmployee, createMockEmployee } from "../../owner/employees/EmployeeTypes";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  onAddEmployee: (employee: IEmployee) => void;
}

const AddNewEmployeeModal: React.FC<Props> = ({ open, setOpen, onAddEmployee }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IEmployee>({
    defaultValues: {
      workType: "Full-time",
      employmentStatus: "Draft",
      attendanceType: "Biometric",
      payFrequency: "Monthly",
      status: "Active",
      systemUserEnabled: false,
      sameAsPresentAddress: true,
      documents: [],
    },
  });

  const handleToggle = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: IEmployee) => {
    try {
      // Generate a mock employee with the form data
      const newEmployee = createMockEmployee({
        ...data,
        employeeId: `EMP${Date.now().toString().slice(-6)}`,
        employeeCode: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "Admin",
        updatedBy: "Admin",
      });
      
      onAddEmployee(newEmployee);
      console.log("Employee Payload:", newEmployee);
      toast.success("Employee added successfully! 🎉");
      
      // Reset form and close modal
      reset();
      setTimeout(() => setOpen(false), 1500);
    } catch {
      toast.error("Failed to add employee.");
    }
  };

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="md">
      <DialogTitle>
        <div className="flex justify-between items-center">
          <h5 className="modal-title">Add New Employee</h5>
          <button onClick={handleToggle} type="button" className="bd-btn-close">
            ✕
          </button>
        </div>
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-4">
            {/* Personal Information */}
            <div className="col-span-12 md:col-span-6">
              <InputField
                id="firstName"
                label="First Name"
                register={register("firstName", {
                  required: "First name is required",
                })}
                error={errors.firstName}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <InputField
                id="lastName"
                label="Last Name"
                register={register("lastName", {
                  required: "Last name is required",
                })}
                error={errors.lastName}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <InputField
                id="email"
                label="Email"
                type="email"
                register={register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={errors.email}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <InputField
                id="phoneNumber"
                label="Phone Number"
                register={register("phoneNumber")}
                error={errors.phoneNumber}
              />
            </div>

            {/* Job Details */}
            <div className="col-span-12 md:col-span-6">
              <InputField
                id="dateOfJoining"
                label="Date of Joining"
                type="date"
                register={register("dateOfJoining", {
                  required: "Date of joining is required",
                })}
                error={errors.dateOfJoining}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <InputField
                id="roleName"
                label="Role"
                register={register("roleName", {
                  required: "Role is required",
                })}
                error={errors.roleName}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <InputField
                id="departmentName"
                label="Department"
                register={register("departmentName", {
                  required: "Department is required",
                })}
                error={errors.departmentName}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <InputField
                id="workLocationName"
                label="Work Location"
                register={register("workLocationName", {
                  required: "Work location is required",
                })}
                error={errors.workLocationName}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label htmlFor="workType" className="form-label">
                  Work Type
                </label>
                <select
                  id="workType"
                  className="form-control"
                  {...register("workType")}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Intern">Intern</option>
                </select>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <div className="form-group">
                <label htmlFor="employmentStatus" className="form-label">
                  Employment Status
                </label>
                <select
                  id="employmentStatus"
                  className="form-control"
                  {...register("employmentStatus")}
                >
                  <option value="Draft">Draft</option>
                  <option value="Active">Active</option>
                  <option value="On Probation">On Probation</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="col-span-12 border-t pt-4">
              <h6 className="mb-3">Emergency Contact</h6>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 md:col-span-6">
                  <InputField
                    id="emergencyContactName"
                    label="Contact Name"
                    register={register("emergencyContactName", {
                      required: "Emergency contact name is required",
                    })}
                    error={errors.emergencyContactName}
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <InputField
                    id="emergencyContactPhone"
                    label="Contact Phone"
                    register={register("emergencyContactPhone", {
                      required: "Emergency contact phone is required",
                    })}
                    error={errors.emergencyContactPhone}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="submit__btn text-center mt-6">
            <button className="btn btn-primary" type="submit">
              Add Employee
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewEmployeeModal;