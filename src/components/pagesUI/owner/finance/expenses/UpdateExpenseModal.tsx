"use client";

import AddExpenseModal from "./AddExpenseModal";
import { IExpense } from "./ExpenseTypes";

interface Props {
  open: boolean;
  setOpen: (b: boolean) => void;
  editData: IExpense;
  onSave: (payload: Partial<IExpense>) => void;
}

const UpdateExpenseModal: React.FC<Props> = ({
  open,
  setOpen,
  editData,
  onSave,
}) => {
  return (
    <AddExpenseModal
      open={open}
      setOpen={setOpen}
      editData={editData}
      onSave={(payload) => onSave({ ...editData, ...payload })}
    />
  );
};

export default UpdateExpenseModal;
