interface CreateUpdateDistrictModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  district?: any;
}

const CreateUpdateDistrictModal = ({ open, handleOpen, district }: CreateUpdateDistrictModalProps) => {
  if (!open) {
    return null;
  }

  return <h1>Test</h1>;
};

export default CreateUpdateDistrictModal;
