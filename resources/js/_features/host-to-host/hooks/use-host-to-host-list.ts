import { PaginationMeta } from "@/_features/_common/types/pagination";
import { useQueryState } from "nuqs";
import React, { useCallback } from "react";
import { useSearchHostToHost } from "../services/host-to-host-query";

interface HostToHost {
  id: number;
  accessed_at: string; // e.g., "2025-04-17"
  auth_prefix: string; // e.g., "token"
  created_at: string; // e.g., "2025-04-09 09:34:31"
  guarantor_id: number;
  guarantor_name: string;
  guarantor_url_host: string; // e.g., URL
  token: string;
  updated_at: string; // e.g., "2025-04-17 13:47:15"
}

export interface HostToHostResponse {
  data: HostToHost[];
  meta: PaginationMeta;
}

const useHostToHostList = () => {
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

  const {
    data: hostToHosts,
    isLoading: isLoadingHostToHosts,
    isSuccess: isSuccessHostToHosts,
  } = useSearchHostToHost<HostToHostResponse>({
    perPage: Number(perPage),
    search: search,
    page: Number(page),
    isPageAble: "true",
  });

  return {
    hostToHosts: hostToHosts?.data,
    meta: hostToHosts?.meta,
    isLoadingHostToHosts,
    isSuccessHostToHosts,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
    perPage,
    page,
    search,
  };
};

export default useHostToHostList;
