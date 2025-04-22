import { FetchParams } from "@/_features/_common/types/fetch";
import { QuerySetting } from "@/_features/_common/types/react-query";
import { QueryOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

export const OFFICE_QUERY_KEY = {
  OFFICE: "office",
  OFFICE_BY_TYPE: "office-by-type",
  OFFICE_TYPES: "office-types",
  OFFICE_SEARCH: "office-search",
};

export type OfficeType = "headquarter" | "branch" | "agent_partner" | "marketing_partner";

export interface OfficeByTypeParams {
  officeType: OfficeType;
  perPage?: number;
  search?: string;
  page?: number;
}

export interface OfficeData {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  regency: string;
  district: string;
  village: string;
  postal_code: string;
  users_count: number;
}

interface PaginationMeta {
  current_page: number;
  from: number;
  to: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface OfficeResponse {
  data: OfficeData[];
  meta: PaginationMeta;
}

export const useGetOfficeByType = (
  params: OfficeByTypeParams,
  querySetting?: Omit<UseQueryOptions<OfficeResponse, Error>, "queryKey" | "queryFn">,
) => {
  return useQuery<OfficeResponse, Error>({
    queryKey: [OFFICE_QUERY_KEY.OFFICE_BY_TYPE, params?.officeType, params?.perPage, params?.search, params?.page],
    queryFn: async (): Promise<OfficeResponse> => {
      const response = await axios.get<{ data: { data: OfficeData[]; meta: PaginationMeta } }>(
        route("api.office-management.office.get-by-type", {
          office_type: params.officeType,
          per_page: params.perPage,
          search: params.search,
          page: params.page,
        }),
      );

      return {
        data: response.data.data.data,
        meta: response.data.data.meta,
      };
    },
    ...querySetting,
    enabled: !!params?.officeType,
  });
};

export const useGetOfficeTypes = <TResponse = unknown>(querySetting?: QueryOptions<TResponse>) => {
  return useQuery({
    queryKey: [OFFICE_QUERY_KEY.OFFICE_TYPES],
    queryFn: async () => {
      const response = await axios.get(route("api.office-management.office.get-office-types"));
      return response.data.data as TResponse;
    },
    ...querySetting,
  });
};

interface OfficeSearchParams extends FetchParams {
  officeType?: "Kantor Pusat" | "Kantor Cabang" | "Mitra Agen" | "Mitra Pemasaran";
}

export const useSearchOffice = <TResponse = unknown>(
  params?: OfficeSearchParams,
  querySetting?: QuerySetting<TResponse>,
) => {
  return useQuery({
    queryKey: [
      OFFICE_QUERY_KEY.OFFICE_SEARCH,
      params?.perPage,
      params?.search,
      params?.page,
      params?.isPageAble,
      params?.officeType,
    ],
    queryFn: async () => {
      const response = await axios.get(
        route("api.office-management.office.search-office", {
          per_page: params?.perPage,
          search: params?.search,
          page: params?.page,
          is_page_able: params?.isPageAble,
          office_type: params?.officeType,
        }),
      );

      return response.data.data as TResponse;
    },
    ...querySetting,
  });
};
