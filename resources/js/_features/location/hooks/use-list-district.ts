import { FetchParams } from "@/_features/_common/types/fetch";
import { PaginationMeta } from "@/_features/_common/types/pagination";
import { useQueryState } from "nuqs";
import React, { useCallback } from "react";
import { useSearchDistricts } from "../services/district-location-query";

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

  // const { data: regencies, isLoading: isLoadingRegencies, isSuccess: isSuccessRegencies } = useGetAllRegency();

  const {
    data: districts,
    isLoading: isLoadingDistricts,
    isSuccess: isSuccessDistricts,
  } = useSearchDistricts<DistrictResponse>({
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
  };
};

export default useListDistrict;
