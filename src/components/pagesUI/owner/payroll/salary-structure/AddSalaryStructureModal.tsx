"use client";

import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import InputField from "@/components/elements/SharedInputs/InputField";
import { statePropsType } from "@/interface/common.interface";
import { ISalaryStructure } from "./SalaryStructureTypes";

interface Props extends statePropsType {
  onSave: (payload: ISalaryStructure) => void;
}

const AddSalaryStructureModal: React.FC<Props> = ({
  open,
  setOpen,
  onSave,
}) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ISalaryStructure>({
    defaultValues: {
      components: [{ id: crypto.randomUUID(), name: "", amount: 0 }],
    },
  });

  const [isEditing,setIsEditing] = useState(false)

  const { fields, append, remove } = useFieldArray({
    control,
    name: "components",
  });

  const onSubmit = (data: ISalaryStructure) => {
    const payload: ISalaryStructure = {
      ...data,
      id: Date.now(),
      created_at: new Date().toISOString(),
      status: "Active",
    };

    onSave(payload);
    toast.success("Salary structure added successfully!");
    setTimeout(() => setOpen(false), 400);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle>Add Salary Structure</DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-6">
            {/* Header info */}
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

            {/* Dynamic Components */}
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
         <div className={!isEditing ? "text-[50px] font-semibold" : ""}>
  <InputField
    id={`components.${index}.amount`}
    label={isEditing ? "Amount" : ""}
    type="number"
    register={register(`components.${index}.amount`, {
      valueAsNumber: true,
      required: isEditing ? "Required" : false,
    })}
    error={errors.components?.[index]?.amount}
  />
</div>


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
              Submit
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSalaryStructureModal;
