import React from "react";

interface DeleteDistrictModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  district: any;
}

const DeleteDistrictModal = ({ open, handleOpen, district }: DeleteDistrictModalProps) => {
  if (!open) {
    return null;
  }

  return <div>DeleteDistrictModal</div>;
};

export default DeleteDistrictModal;
