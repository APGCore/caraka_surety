import React, { useState } from "react";

interface DeleteRegencyModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  regency: any;
}

const DeleteRegencyModal = ({ open, handleOpen, regency }: DeleteRegencyModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!open) {
    return null;
  }

  return <div>DeleteRegencyModal</div>;
};

export default DeleteRegencyModal;
