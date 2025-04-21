import { useCallback, useState } from "react";

const useProductTypeLimitModal = () => {
  const [isOpenDetailProductTypeLimit, setIsOpenDetailProductTypeLimit] = useState<boolean>(false);
  const [isOpenCreateProductTypeLimit, setIsOpenCreateProductTypeLimit] = useState<boolean>(false);
  const [isOpenUpdateProductTypeLimit, setIsOpenUpdateProductTypeLimit] = useState<boolean>(false);
  const [isOpenDeleteProductTypeLimit, setIsOpenDeleteProductTypeLimit] = useState<boolean>(false);
  const [selectedProductTypeLimit, setSelectedProductTypeLimit] = useState<object | null>(null);

  const handleOpenDetailProductTypeLimit = useCallback((isOpen: boolean, productTypeLimit?: object) => {
    if (productTypeLimit && Object.keys(productTypeLimit).length > 0) {
      setSelectedProductTypeLimit(productTypeLimit);
    } else {
      setSelectedProductTypeLimit(null);
    }
    setIsOpenDetailProductTypeLimit(isOpen);
  }, []);

  const handleOpenCreateProductTypeLimit = useCallback((isOpen: boolean) => {
    setIsOpenCreateProductTypeLimit(isOpen);
  }, []);

  const handleOpenDeleteProductTypeLimit = useCallback((isOpen: boolean, productTypeLimit?: object) => {
    if (productTypeLimit && Object.keys(productTypeLimit).length > 0) {
      setSelectedProductTypeLimit(productTypeLimit);
    } else {
      setSelectedProductTypeLimit(null);
    }
    setIsOpenDeleteProductTypeLimit(isOpen);
  }, []);

  const handleOpenUpdateProductTypeLimit = useCallback((isOpen: boolean, productTypeLimit?: object) => {
    if (productTypeLimit && Object.keys(productTypeLimit).length > 0) {
      setSelectedProductTypeLimit(productTypeLimit);
    } else {
      setSelectedProductTypeLimit(null);
    }

    setIsOpenUpdateProductTypeLimit(isOpen);
  }, []);

  return {
    isOpenUpdateProductTypeLimit,
    handleOpenUpdateProductTypeLimit,
    isOpenDeleteProductTypeLimit,
    handleOpenDeleteProductTypeLimit,
    selectedProductTypeLimit,
    setSelectedProductTypeLimit,
    isOpenCreateProductTypeLimit,
    handleOpenCreateProductTypeLimit,
    isOpenDetailProductTypeLimit,
    handleOpenDetailProductTypeLimit,
  };
};

export default useProductTypeLimitModal;
