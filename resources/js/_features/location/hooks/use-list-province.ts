import { PaginationMeta } from "@/_features/_common/types/pagination";
import { useQueryState } from "nuqs";
import React, { useCallback } from "react";
import { useSearchProvinces } from "../services/province-location-query";

interface Province {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface ProvinceResponse {
  data: Province[];
  meta: PaginationMeta;
}

const useListProvince = () => {
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
    data: provinces,
    isLoading: isLoadingProvinces,
    isSuccess: isSuccessProvinces,
  } = useSearchProvinces<ProvinceResponse>({
    perPage: Number(perPage),
    search,
    page: Number(page),
  });

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    if (search?.length > 0) {
      setPage("1");
    }
  }, []);

  const handlePerPageChange = useCallback((value: string) => {
    setPerPage(value);
    setPage("1");
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPage(page.toString());
  }, []);

  return {
    provinces: provinces?.data,
    meta: provinces?.meta,
    isLoadingProvinces,
    isSuccessProvinces,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
    perPage,
    page,
    search,
  };
};

export default useListProvince;
