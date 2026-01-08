"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IDepartment } from "./DepartmentTypes";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editData: IDepartment | null;
  onSave: (payload: Partial<IDepartment>) => void;
}

const UpdateDepartmentModal: React.FC<Props> = ({
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
  } = useForm<IDepartment>();

  const [status, setStatus] = useState<boolean>(true);

  useEffect(() => {
    if (editData) {
      reset(editData);
      setStatus(editData.status === "Active");
    }
  }, [editData, reset]);

  const departmentList = [
    {
      id: 1,
      name: "HR",
      departmentCode: "HR01",
      subDepartments: [
        { id: 3, name: "Recruitment", departmentCode: "HR01-1" },
        { id: 4, name: "Employee Relations", departmentCode: "HR01-2" },
      ],
    },
    {
      id: 2,
      name: "IT",
      departmentCode: "IT01",
      subDepartments: [
        { id: 5, name: "Infrastructure", departmentCode: "IT01-1" },
        { id: 6, name: "Software Development", departmentCode: "IT01-2" },
      ],
    },
  ];

  // Flatten departments + sub-departments for datalist
  const datalistOptions = departmentList.flatMap((dep) => [
    {
      id: dep.id,
      label: `${dep.name} (${dep.departmentCode})`,
    },
    ...dep.subDepartments.map((sub) => ({
      id: sub.id,
      label: `${sub.name} (${sub.departmentCode})`,
    })),
  ]);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.checked);
  };

  const onSubmit = (data: IDepartment) => {
    if (!editData) return;

    const updatedData = {
      ...editData,
      ...data,
      status: status ? "Active" : "Inactive",
    };

    onSave(updatedData);
    toast.success("Department updated successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>Update Department</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-6">
              <div className="mb-4">
                <label className="form-label">Department Name</label>
                <input
                  className="form-control"
                  {...register("departmentName", { required: "Required" })}
                />
                {errors.departmentName && (
                  <span className="text-red-500 text-sm">
                    {errors.departmentName.message}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-6">
              <div className="mb-4">
                <label className="form-label">Department Code</label>
                <input
                  className="form-control"
                  {...register("departmentCode", { required: "Required" })}
                />
                {errors.departmentCode && (
                  <span className="text-red-500 text-sm">
                    {errors.departmentCode.message}
                  </span>
                )}
              </div>
            </div>

            <div className="col-span-6">
              <div className="mb-4">
                <label className="form-label">Manager Name</label>
                <input
                  className="form-control"
                  {...register("managerName")}
                />
              </div>
            </div>

            <div className="col-span-6">
              <div className="mb-4">
                <label className="form-label">Department Type</label>
                <select
                  className="form-control"
                  {...register("departmentType")}
                >
                  <option value="Technical">Technical</option>
                  <option value="Administrative">Administrative</option>
                  <option value="Support">Support</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>

            <div className="col-span-6">
              <div className="mb-4">
                <label className="form-label">Manager Email</label>
                <input
                  className="form-control"
                  type="email"
                  {...register("managerEmail")}
                />
              </div>
            </div>

            <div className="col-span-6">
              <div className="mb-4">
                <label className="form-label">Manager Phone</label>
                <input
                  className="form-control"
                  {...register("managerPhone")}
                />
              </div>
            </div>

            <div className="col-span-6">
              <div className="mb-4">
                <label className="form-label">Location</label>
                <input
                  className="form-control"
                  {...register("location")}
                />
              </div>
            </div>

            <div className="col-span-6 flex items-center">
              <FormControlLabel
                control={
                  <Switch
                    checked={status}
                    onChange={handleStatusChange}
                    size="medium"
                    color="primary"
                  />
                }
                label={status ? "Active" : "Inactive"}
              />
            </div>

            <div className="col-span-6">
              <div className="mb-4">
                <label className="form-label">Budget</label>
                <input
                  className="form-control"
                  type="number"
                  {...register("budget")}
                />
              </div>
            </div>

            <div className="col-span-6">
              <div className="mb-4">
                <label className="form-label">Employee Count</label>
                <input
                  className="form-control"
                  type="number"
                  {...register("employeeCount")}
                />
              </div>
            </div>

            <div className="col-span-12">
              <div className="mb-4">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  {...register("description")}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" type="submit">
              Update
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDepartmentModal;