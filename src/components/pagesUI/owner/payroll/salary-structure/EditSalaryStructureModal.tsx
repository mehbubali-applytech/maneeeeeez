"use client";

import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";

import InputField from "@/components/elements/SharedInputs/InputField"
import { statePropsType } from "@/interface/common.interface";
import { ISalaryStructure } from "./SalaryStructureTypes";

interface Props extends statePropsType {
  editData: ISalaryStructure;
  onSave: (payload: ISalaryStructure) => void;
}

const EditSalaryStructureModal: React.FC<Props> = ({
  open,
  setOpen,
  editData,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ISalaryStructure>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "components",
  });

  useEffect(() => {
    reset(editData);
  }, [editData, reset]);

  const onSubmit = (data: ISalaryStructure) => {
    onSave({ ...editData, ...data });
    toast.success("Salary structure updated successfully!");
    setTimeout(() => setOpen(false), 400);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle>Edit Salary Structure</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-6">
              <InputField
                id="structureName"
                label="Structure Name"
                register={register("structureName", { required: "Required" })}
                error={errors.structureName}
              />
            </div>

            <div className="col-span-6">
              <InputField
                id="structureCode"
                label="Structure Code"
                register={register("structureCode", { required: "Required" })}
                error={errors.structureCode}
              />
            </div>

            <div className="col-span-12 mt-4">
              <h4 className="font-semibold mb-2">Salary Components</h4>
            </div>

            {fields.map((field, index) => (
              <React.Fragment key={field.id}>
                <div className="col-span-6">
                  <InputField
                    id={`components.${index}.name`}
                    label="Component Name"
                    register={register(`components.${index}.name`, {
                      required: "Required",
                    })}
                    error={errors.components?.[index]?.name}
                  />
                </div>

                <div className="col-span-4">
                  <InputField
                    id={`components.${index}.amount`}
                    label="Amount"
                    type="number"
                    register={register(`components.${index}.amount`, {
                      valueAsNumber: true,
                      required: "Required",
                    })}
                    error={errors.components?.[index]?.amount}
                  />
                </div>

                <div className="col-span-2 flex items-end">
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </button>
                </div>
              </React.Fragment>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() =>
                append({
                  id: crypto.randomUUID(),
                  name: "",
                  amount: 0,
                })
              }
            >
              + Add Component
            </button>

            <button className="btn btn-primary" type="submit">
              Save Changes
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSalaryStructureModal;
