import { useCallback, useState } from "react";

const useProvinceModal = () => {
  const [isOpenDetailProvince, setIsOpenDetailProvince] = useState<boolean>(false);
  const [isOpenCreateProvince, setIsOpenCreateProvince] = useState<boolean>(false);
  const [isOpenUpdateProvince, setIsOpenUpdateProvince] = useState<boolean>(false);
  const [isOpenDeleteProvince, setIsOpenDeleteProvince] = useState<boolean>(false);
  const [selectedProvince, setSelectedProvince] = useState<object | null>(null);

  const handleOpenDetailProvince = useCallback((isOpen: boolean, province?: object) => {
    if (province && Object.keys(province).length > 0) {
      setSelectedProvince(province);
    } else {
      setSelectedProvince(null);
    }
    setIsOpenDetailProvince(isOpen);
  }, []);

  const handleOpenCreateProvince = useCallback((isOpen: boolean) => {
    setIsOpenCreateProvince(isOpen);
  }, []);

  const handleOpenDeleteProvince = useCallback((isOpen: boolean, province?: object) => {
    if (province && Object.keys(province).length > 0) {
      setSelectedProvince(province);
    } else {
      setSelectedProvince(null);
    }
    setIsOpenDeleteProvince(isOpen);
  }, []);

  const handleOpenUpdateProvince = useCallback((isOpen: boolean, province?: object) => {
    if (province && Object.keys(province).length > 0) {
      setSelectedProvince(province);
    } else {
      setSelectedProvince(null);
    }

    setIsOpenUpdateProvince(isOpen);
  }, []);

  return {
    isOpenDetailProvince,
    handleOpenDetailProvince,
    isOpenCreateProvince,
    handleOpenCreateProvince,
    isOpenUpdateProvince,
    handleOpenUpdateProvince,
    isOpenDeleteProvince,
    handleOpenDeleteProvince,
    selectedProvince,
    setSelectedProvince,
  };
};

export default useProvinceModal;
