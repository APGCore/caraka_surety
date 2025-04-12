import React from "react";

interface DetailRegencyModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
}

const DetailRegencyModal = ({ open, handleOpen }: DetailRegencyModalProps) => {
  if (!open) {
    return null;
  }

  return <div>DetailRegencyModal</div>;
};

export default DetailRegencyModal;
