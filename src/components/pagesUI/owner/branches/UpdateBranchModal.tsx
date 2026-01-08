// UpdateBranchModal.tsx
"use client";

import React from "react";
import AddBranchModal from "./AddBranchModal";
import { IBranch } from "./BranchTypes";

interface UpdateBranchModalProps {
  open: boolean;
  setOpen: (b: boolean) => void;
  editData: IBranch | null;
  onSave: (payload: IBranch) => void;
}

const UpdateBranchModal: React.FC<UpdateBranchModalProps> = ({
  open,
  setOpen,
  editData,
  onSave,
}) => {
  // Reuse AddBranchModal but adapt onSave to include id if editing
  const handleSave = (payload: Partial<IBranch>) => {
    if (!editData) {
      // create case (unlikely for update modal, but keep generic)
      onSave({ ...(payload as IBranch) });
    } else {
      onSave({ ...editData, ...(payload as IBranch) });
    }
  };

  return (
    <AddBranchModal
      open={open}
      setOpen={setOpen}
      editData={editData ?? undefined}
      onSave={handleSave}
    />
  );
};

export default UpdateBranchModal;
