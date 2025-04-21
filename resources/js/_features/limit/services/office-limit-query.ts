import { FetchParams } from "@/_features/_common/types/fetch";
import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const OFFICE_LIMIT_QUERY_KEY = {
  SEARCH: "search-office-limit",
};

interface SearchOfficeLimitParams extends FetchParams {
  productId?: string;
  productTypeId?: string;
  officeType?: string;
  jobGroup?: string;
}

export const useSearchOfficeLimit = <TResponse = unknown>(
  params?: SearchOfficeLimitParams,
  querySetting?: QueryOptions<TResponse>,
) => {
  return useQuery({
    queryKey: [
      OFFICE_LIMIT_QUERY_KEY.SEARCH,
      params?.isPageAble,
      params?.perPage,
      params?.search,
      params?.page,
      params?.productId,
      params?.productTypeId,
      params?.officeType,
      params?.jobGroup,
    ],
    queryFn: async () => {
      const response = await axios.get(
        route("api.limit-management.profile-limit.search-profile-limit", {
          is_page_able: params?.isPageAble,
          per_page: params?.perPage,
          search: params?.search,
          page: params?.page,
          product_id: params?.productId,
          product_type_id: params?.productTypeId,
          office_type: params?.officeType,
          job_group: params?.jobGroup,
        }),
      );

      return response.data.data as TResponse;
    },
    ...querySetting,
  });
};
