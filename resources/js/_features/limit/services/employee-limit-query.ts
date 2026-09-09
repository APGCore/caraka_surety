import { FetchParams } from "@/_features/_common/types/fetch";
import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const EMPLOYEE_LIMIT_QUERY_KEY = {
  SEARCH: "search-employee-limit",
};

interface SearchEmployeeLimitParams extends FetchParams {
  guarantorId?: string;
  productId?: string;
  productTypeId?: string;
  officeType?: string;
  jobGroup?: string;
  officeId?: string;
}

export const useSearchEmployeeLimit = <TResponse = unknown>(
  params?: SearchEmployeeLimitParams,
  querySetting?: QueryOptions<TResponse>,
) => {
  return useQuery({
    queryKey: [
      EMPLOYEE_LIMIT_QUERY_KEY.SEARCH,
      params?.isPageAble,
      params?.perPage,
      params?.search,
      params?.page,
      params?.guarantorId,
      params?.productId,
      params?.productTypeId,
      params?.officeType,
      params?.jobGroup,
      params?.officeId,
    ],
    queryFn: async () => {
      const response = await axios.get(
        route("api.limit-management.employee-limit.search-employee-limit", {
          is_page_able: params?.isPageAble,
          per_page: params?.perPage,
          search: params?.search,
          page: params?.page,
          guarantor_id: params?.guarantorId,
          product_id: params?.productId,
          product_type_id: params?.productTypeId,
          office_type: params?.officeType,
          job_group: params?.jobGroup,
          office_id: params?.officeId,
        }),
      );

      return response.data as TResponse;
    },
    ...querySetting,
  });
};
