import { FetchParams } from "@/_features/_common/types/fetch";
import { PaginationMeta } from "@/_features/_common/types/pagination";
import { useQueryState } from "nuqs";
import React, { useCallback, useEffect } from "react";
import { useSearchDistricts } from "../services/district-location-query";
import { useGetAllProvince } from "../services/province-location-query";
import { useGetRegencyByProvinceId } from "../services/regency-location-query";

interface District {
  id: number;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface DistrictResponse {
  data: District[];
  meta: PaginationMeta;
}

const useListDistrict = () => {
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

  const [regencyId, setRegencyId] = useQueryState("regency_id", {
    defaultValue: "",
    history: "push",
    parse: (value) => value || "",
    serialize: (value) => value,
  });

  const {
    data: districts,
    isLoading: isLoadingDistricts,
    isSuccess: isSuccessDistricts,
  } = useSearchDistricts<DistrictResponse>({
    perPage: Number(perPage),
    search,
    page: Number(page),
    regency_id: regencyId ?? undefined,
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

  const { data: provinces, isLoading: isLoadingProvinces, isSuccess: isSuccessProvinces } = useGetAllProvince();

  const { data: regencies, isLoading: isLoadingRegencies, isSuccess: isSuccessRegencies } = useGetRegencyByProvinceId(provinceId);

  return {
    districts: districts?.data,
    meta: districts?.meta,
    isLoadingDistricts,
    isSuccessDistricts,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
    perPage,
    page,
    search,
    provinces,
    isLoadingProvinces,
    isSuccessProvinces,
    provinceId,
    setProvinceId,
    regencies,
    isLoadingRegencies,
    isSuccessRegencies,
    regencyId,
    setRegencyId,
  };
};

export default useListDistrict;
