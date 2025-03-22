import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

export const OFFICE_QUERY_KEY = {
  OFFICE: "office",
  OFFICE_BY_TYPE: "office-by-type",
};

export type OfficeType = "headquarter" | "branch" | "agent_partner" | "marketing_partner";

export interface OfficeByTypeParams {
  officeType: OfficeType;
  perPage?: number;
  search?: string;
  page?: number;
}

interface OfficeData {
  id: number;
  code: string;
  name: string;
  email: string | null;
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
