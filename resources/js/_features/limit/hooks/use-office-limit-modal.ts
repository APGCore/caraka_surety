import { useCallback, useState } from "react";

const useOfficeLimitModal = () => {
  const [isOpenDetailOfficeLimit, setIsOpenDetailOfficeLimit] = useState<boolean>(false);
  const [isOpenCreateOfficeLimit, setIsOpenCreateOfficeLimit] = useState<boolean>(false);
  const [isOpenUpdateOfficeLimit, setIsOpenUpdateOfficeLimit] = useState<boolean>(false);
  const [isOpenDeleteOfficeLimit, setIsOpenDeleteOfficeLimit] = useState<boolean>(false);
  const [selectedOfficeLimit, setSelectedOfficeLimit] = useState<object | null>(null);

  const handleOpenDetailOfficeLimit = useCallback((isOpen: boolean, officeLimit?: object) => {
    if (officeLimit && Object.keys(officeLimit).length > 0) {
      setSelectedOfficeLimit(officeLimit);
    } else {
      setSelectedOfficeLimit(null);
    }
    setIsOpenDetailOfficeLimit(isOpen);
  }, []);

  const handleOpenCreateOfficeLimit = useCallback((isOpen: boolean) => {
    setIsOpenCreateOfficeLimit(isOpen);
  }, []);

  const handleOpenDeleteOfficeLimit = useCallback((isOpen: boolean, officeLimit?: object) => {
    if (officeLimit && Object.keys(officeLimit).length > 0) {
      setSelectedOfficeLimit(officeLimit);
    } else {
      setSelectedOfficeLimit(null);
    }
    setIsOpenDeleteOfficeLimit(isOpen);
  }, []);

  const handleOpenUpdateOfficeLimit = useCallback((isOpen: boolean, officeLimit?: object) => {
    if (officeLimit && Object.keys(officeLimit).length > 0) {
      setSelectedOfficeLimit(officeLimit);
    } else {
      setSelectedOfficeLimit(null);
    }

    setIsOpenUpdateOfficeLimit(isOpen);
  }, []);

  return {
    isOpenUpdateOfficeLimit,
    handleOpenUpdateOfficeLimit,
    isOpenDeleteOfficeLimit,
    handleOpenDeleteOfficeLimit,
    selectedOfficeLimit,
    setSelectedOfficeLimit,
    isOpenCreateOfficeLimit,
    handleOpenCreateOfficeLimit,
    isOpenDetailOfficeLimit,
    handleOpenDetailOfficeLimit,
  };
};

export default useOfficeLimitModal;
