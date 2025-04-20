import { useCallback, useState } from "react";

const useHostToHostModal = () => {
  const [isOpenDetailHostToHost, setIsOpenDetailHostToHost] = useState<boolean>(false);
  const [isOpenCreateHostToHost, setIsOpenCreateHostToHost] = useState<boolean>(false);
  const [isOpenUpdateHostToHost, setIsOpenUpdateHostToHost] = useState<boolean>(false);
  const [isOpenDeleteHostToHost, setIsOpenDeleteHostToHost] = useState<boolean>(false);
  const [selectedHostToHost, setSelectedHostToHost] = useState<object | null>(null);

  const handleOpenDetailHostToHost = useCallback((isOpen: boolean, hostToHost?: object) => {
    if (hostToHost && Object.keys(hostToHost).length > 0) {
      setSelectedHostToHost(hostToHost);
    } else {
      setSelectedHostToHost(null);
    }
    setIsOpenDetailHostToHost(isOpen);
  }, []);

  const handleOpenCreateHostToHost = useCallback((isOpen: boolean) => {
    setIsOpenCreateHostToHost(isOpen);
  }, []);

  const handleOpenDeleteHostToHost = useCallback((isOpen: boolean, hostToHost?: object) => {
    if (hostToHost && Object.keys(hostToHost).length > 0) {
      setSelectedHostToHost(hostToHost);
    } else {
      setSelectedHostToHost(null);
    }
    setIsOpenDeleteHostToHost(isOpen);
  }, []);

  const handleOpenUpdateHostToHost = useCallback((isOpen: boolean, hostToHost?: object) => {
    if (hostToHost && Object.keys(hostToHost).length > 0) {
      setSelectedHostToHost(hostToHost);
    } else {
      setSelectedHostToHost(null);
    }

    setIsOpenUpdateHostToHost(isOpen);
  }, []);

  return {
    isOpenDetailHostToHost,
    handleOpenDetailHostToHost,
    isOpenCreateHostToHost,
    handleOpenCreateHostToHost,
    isOpenUpdateHostToHost,
    handleOpenUpdateHostToHost,
    isOpenDeleteHostToHost,
    handleOpenDeleteHostToHost,
    selectedHostToHost,
    setSelectedHostToHost,
  };
};

export default useHostToHostModal;
