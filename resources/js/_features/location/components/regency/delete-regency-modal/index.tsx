import React from "react";

interface DeleteRegencyModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
}

const DeleteRegencyModal = ({ open, handleOpen }: DeleteRegencyModalProps) => {
  if (!open) {
    return null;
  }

  return <div>DeleteRegencyModal</div>;
};

export default DeleteRegencyModal;
