import { useCallback, useState } from "react";

const useEmployeeLimitModal = () => {
  const [isOpenDetailEmployeeLimit, setIsOpenDetailEmployeeLimit] = useState<boolean>(false);
  const [isOpenCreateEmployeeLimit, setIsOpenCreateEmployeeLimit] = useState<boolean>(false);
  const [isOpenUpdateEmployeeLimit, setIsOpenUpdateEmployeeLimit] = useState<boolean>(false);
  const [isOpenDeleteEmployeeLimit, setIsOpenDeleteEmployeeLimit] = useState<boolean>(false);
  const [selectedEmployeeLimit, setSelectedEmployeeLimit] = useState<object | null>(null);

  const handleOpenDetailEmployeeLimit = useCallback((isOpen: boolean, employeeLimit?: object) => {
    if (employeeLimit && Object.keys(employeeLimit).length > 0) {
      setSelectedEmployeeLimit(employeeLimit);
    } else {
      setSelectedEmployeeLimit(null);
    }
    setIsOpenDetailEmployeeLimit(isOpen);
  }, []);

  const handleOpenCreateEmployeeLimit = useCallback((isOpen: boolean) => {
    setIsOpenCreateEmployeeLimit(isOpen);
  }, []);

  const handleOpenDeleteOfficeLimit = useCallback((isOpen: boolean, employeeLimit?: object) => {
    if (employeeLimit && Object.keys(employeeLimit).length > 0) {
      setSelectedEmployeeLimit(employeeLimit);
    } else {
      setSelectedEmployeeLimit(null);
    }
    setIsOpenDeleteEmployeeLimit(isOpen);
  }, []);

  const handleOpenUpdateEmployeeLimit = useCallback((isOpen: boolean, employeeLimit?: object) => {
    if (employeeLimit && Object.keys(employeeLimit).length > 0) {
      setSelectedEmployeeLimit(employeeLimit);
    } else {
      setSelectedEmployeeLimit(null);
    }

    setIsOpenUpdateEmployeeLimit(isOpen);
  }, []);

  return {
    isOpenUpdateEmployeeLimit,
    handleOpenUpdateEmployeeLimit,
    isOpenDeleteEmployeeLimit,
    handleOpenDeleteOfficeLimit,
    selectedEmployeeLimit,
    setSelectedEmployeeLimit,
    isOpenCreateEmployeeLimit,
    handleOpenCreateEmployeeLimit,
    isOpenDetailEmployeeLimit,
    handleOpenDetailEmployeeLimit,
  };
};

export default useEmployeeLimitModal;
