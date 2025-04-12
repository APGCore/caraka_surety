import { PaginationMeta } from "@/_features/_common/types/pagination";
import { useQueryState } from "nuqs";
import React, { useCallback } from "react";
import { useGetAllProvince } from "../services/province-location-query";
import { useSearchRegencies } from "../services/regency-location-query";

interface Regency {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface RegencyResponse {
  data: Regency[];
  meta: PaginationMeta;
}

const useListRegency = () => {
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

  const [provinceId, setProvinceId] = useQueryState("province_id", {
    defaultValue: "",
    history: "push",
    parse: (value) => value || "",
    serialize: (value) => value,
  });

  const { data: provinces, isLoading: isLoadingProvinces, isSuccess: isSuccessProvinces } = useGetAllProvince();

  const {
    data: regencies,
    isLoading: isLoadingRegencies,
    isSuccess: isSuccessRegencies,
  } = useSearchRegencies<RegencyResponse>({
    perPage: Number(perPage),
    search,
    page: Number(page),
    province_id: provinceId ? Number(provinceId) : undefined, // check because provinceId default value is empty string
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

  const handleProvinceChange = useCallback((value: string) => {
    setProvinceId(value);
    setPage("1");
  }, []);

  return {
    regencies: regencies?.data,
    meta: regencies?.meta,
    isLoadingRegencies,
    isSuccessRegencies,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
    perPage,
    page,
    search,
    handleProvinceChange,
    provinces,
    isLoadingProvinces,
    isSuccessProvinces,
  };
};

export default useListRegency;
