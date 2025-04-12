import React from "react";

interface DetailDistrictModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
}

const DetailDistrictModal = ({ open, handleOpen }: DetailDistrictModalProps) => {
  if (!open) {
    return null;
  }

  return <div>DetailDistrictModal</div>;
};

export default DetailDistrictModal;
