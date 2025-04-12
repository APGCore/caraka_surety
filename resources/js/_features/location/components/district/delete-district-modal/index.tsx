import React from "react";

interface DeleteDistrictModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
}

const DeleteDistrictModal = ({ open, handleOpen }: DeleteDistrictModalProps) => {
  return <div>DeleteDistrictModal</div>;
};

export default DeleteDistrictModal;
