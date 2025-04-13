import React from "react";

interface DetailDistrictModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  district: any;
}

const DetailDistrictModal = ({ open, handleOpen, district }: DetailDistrictModalProps) => {
  if (!open) {
    return null;
  }

  return <div>DetailDistrictModal</div>;
};

export default DetailDistrictModal;
