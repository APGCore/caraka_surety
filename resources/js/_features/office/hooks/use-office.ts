import { useQueryState } from "nuqs";
import React, { useCallback } from "react";
import { OfficeType, useGetOfficeByType } from "../services/office-query";

interface UseOfficeProps {
  officeType: OfficeType;
}

const useOffice = ({ officeType }: UseOfficeProps) => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    history: "push",
    parse: (value) => decodeURIComponent(value || ""),
    serialize: (value) => encodeURIComponent(value || ""),
  });

  const [perPage, setPerPage] = useQueryState("per_page", {
    defaultValue: "10",
    history: "push",
    parse: (value) => value || "10",
    serialize: (value) => value,
  });

  const [page, setPage] = useQueryState("page", {
    defaultValue: "1",
    history: "push",
    parse: (value) => value || "1",
    serialize: (value) => value,
  });

  const {
    data: offices,
    isLoading: isLoadingOffice,
    isSuccess: isSuccessOffice,
  } = useGetOfficeByType({
    officeType,
    perPage: Number(perPage),
    search,
    page: Number(page),
  });

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, []);

  const handlePerPageChange = useCallback((value: string) => {
    setPerPage(value);
    setPage("1");
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPage(page.toString());
  }, []);

  return {
    offices: offices?.data,
    meta: offices?.meta,
    isLoadingOffice,
    isSuccessOffice,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
    perPage,
    page,
    search,
  };
};

export default useOffice;
