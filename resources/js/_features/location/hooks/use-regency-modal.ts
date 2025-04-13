import { useCallback, useState } from "react";

const useRegencyModal = () => {
  const [isOpenDetailRegency, setIsOpenDetailRegency] = useState<boolean>(false);
  const [isOpenCreateRegency, setIsOpenCreateRegency] = useState<boolean>(false);
  const [isOpenUpdateRegency, setIsOpenUpdateRegency] = useState<boolean>(false);
  const [isOpenDeleteRegency, setIsOpenDeleteRegency] = useState<boolean>(false);
  const [selectedRegency, setSelectedRegency] = useState<object | null>(null);

  const handleOpenDetailRegency = useCallback((isOpen: boolean, regency?: object) => {
    if (regency && Object.keys(regency).length > 0) {
      setSelectedRegency(regency);
    } else {
      setSelectedRegency(null);
    }
    setIsOpenDetailRegency(isOpen);
  }, []);

  const handleOpenCreateRegency = useCallback((isOpen: boolean) => {
    setIsOpenCreateRegency(isOpen);
  }, []);

  const handleOpenDeleteRegency = useCallback((isOpen: boolean, regency?: object) => {
    if (regency && Object.keys(regency).length > 0) {
      setSelectedRegency(regency);
    } else {
      setSelectedRegency(null);
    }
    setIsOpenDeleteRegency(isOpen);
  }, []);

  const handleOpenUpdateRegency = useCallback((isOpen: boolean, regency?: object) => {
    if (regency && Object.keys(regency).length > 0) {
      setSelectedRegency(regency);
    } else {
      setSelectedRegency(null);
    }

    setIsOpenUpdateRegency(isOpen);
  }, []);

  return {
    isOpenDetailRegency,
    handleOpenDetailRegency,
    isOpenCreateRegency,
    handleOpenCreateRegency,
    isOpenUpdateRegency,
    handleOpenUpdateRegency,
    isOpenDeleteRegency,
    handleOpenDeleteRegency,
    selectedRegency,
    setSelectedRegency,
  };
};

export default useRegencyModal;
