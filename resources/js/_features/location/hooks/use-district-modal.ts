import { useCallback, useState } from "react";

const useDistrictModal = () => {
  const [isOpenDetailDistrict, setIsOpenDetailDistrict] = useState<boolean>(false);
  const [isOpenCreateDistrict, setIsOpenCreateDistrict] = useState<boolean>(false);
  const [isOpenUpdateDistrict, setIsOpenUpdateDistrict] = useState<boolean>(false);
  const [isOpenDeleteDistrict, setIsOpenDeleteDistrict] = useState<boolean>(false);
  const [selectedDistrict, setSelectedDistrict] = useState<object | null>(null);

  const handleOpenDetailDistrict = useCallback((isOpen: boolean, district?: object) => {
    if (district && Object.keys(district).length > 0) {
      setSelectedDistrict(district);
    } else {
      setSelectedDistrict(null);
    }
    setIsOpenDetailDistrict(isOpen);
  }, []);

  const handleOpenCreateDistrict = useCallback((isOpen: boolean) => {
    setIsOpenCreateDistrict(isOpen);
  }, []);

  const handleOpenDeleteDistrict = useCallback((isOpen: boolean, district?: object) => {
    if (district && Object.keys(district).length > 0) {
      setSelectedDistrict(district);
    } else {
      setSelectedDistrict(null);
    }
    setIsOpenDeleteDistrict(isOpen);
  }, []);

  const handleOpenUpdateDistrict = useCallback((isOpen: boolean, district?: object) => {
    if (district && Object.keys(district).length > 0) {
      setSelectedDistrict(district);
    } else {
      setSelectedDistrict(null);
    }

    setIsOpenUpdateDistrict(isOpen);
  }, []);

  return {
    isOpenDetailDistrict,
    handleOpenDetailDistrict,
    isOpenCreateDistrict,
    handleOpenCreateDistrict,
    isOpenUpdateDistrict,
    handleOpenUpdateDistrict,
    isOpenDeleteDistrict,
    handleOpenDeleteDistrict,
    selectedDistrict,
    setSelectedDistrict,
  };
};

export default useDistrictModal;
