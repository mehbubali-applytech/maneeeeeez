"use client";
import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import ModalWarningSvg from "@/svg/ModalWarningSvg";

interface StatePropsType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
}

const DeleteModal: React.FC<StatePropsType> = ({
  open,
  setOpen,
  onConfirm,
}) => {
  const handleToggle = () => setOpen((prev) => !prev);

  const handleDelete = () => {
    onConfirm();     // ✅ parent decides WHAT to delete
    setOpen(false);  // ✅ modal only controls UI
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleToggle}
      fullWidth
      maxWidth="sm"
      sx={{
        "& .MuiDialog-paper": {
          width: "350px",
        },
      }}
    >
      <DialogContent>
        <div className="flex flex-col items-center text-center">
          <div className="bg-orange-100 text-orange-500 rounded-full p-4 mb-4">
            <ModalWarningSvg />
          </div>

          <h2 className="text-lg font-semibold text-gray-800">
            Are you sure?
          </h2>

          <p className="text-sm text-gray-600">
            You won&apos;t be able to revert this!
          </p>
        </div>

        <div className="mt-6 flex justify-center gap-4 mt-6">
          <button onClick={handleCancel} className="btn bg-gray-200">
            Cancel
          </button>

          <button
            onClick={handleDelete}
            className="btn btn-primary !m-0"
          >
            Yes, delete it!
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
