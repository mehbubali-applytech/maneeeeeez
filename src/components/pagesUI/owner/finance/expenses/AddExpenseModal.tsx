"use client";

import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import InputField from "@/components/elements/SharedInputs/InputField";
import SelectBox from "@/components/elements/SharedInputs/SelectBox";
import { IExpense } from "./ExpenseTypes";

interface Props {
  open: boolean;
  setOpen: (b: boolean) => void;
  editData?: IExpense | null;
  onSave: (payload: Partial<IExpense>) => void;
}

const statusOptions = [
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

const AddExpenseModal: React.FC<Props> = ({
  open,
  setOpen,
  editData = null,
  onSave,
}) => {
  const { register, handleSubmit, reset, control, formState: { errors } } =
    useForm<IExpense>();

  useEffect(() => {
    editData ? reset(editData) : reset({});
  }, [editData, reset]);

  const onSubmit = (data: IExpense) => {
    if (!data.expenseTitle) {
      toast.error("Expense title required");
      return;
    }
    onSave(data);
    toast.success(editData ? "Expense updated" : "Expense added");
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>{editData ? "Update Expense" : "Add Expense"}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField label="Title" id="expenseTitle" register={register("expenseTitle")} error={errors.expenseTitle} />
          <InputField label="Category" id="expenseCategory" register={register("expenseCategory")} />
          <InputField label="Amount" id="amount" type="number" register={register("amount", { valueAsNumber: true })} />
          <InputField label="Date" id="expenseDate" type="date" register={register("expenseDate")} />

          <SelectBox
            id="status"
            label="Status"
            options={statusOptions}
            control={control}
          />

          <button type="submit" className="btn btn-primary mt-4">
            {editData ? "Update" : "Create"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExpenseModal;
