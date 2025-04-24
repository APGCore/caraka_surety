import { FetchParams } from "@/_features/_common/types/fetch";
import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const GUARANTOR_PRODUCT_TYPE_LIMIT_QUERY_KEY = {
  GUARANTOR_PRODUCT_TYPE_LIMIT: "guarantor_product_type_limit",
};

interface SearchProductTypeLimitParams extends FetchParams {
  productId?: string;
  jobGroup?: string;
  isPageAble?: "true" | "false";
}

export const useSearchProductTypeLimit = <TResponse = unknown>(
  params?: SearchProductTypeLimitParams,
  querySetting?: QueryOptions<TResponse>,
) => {
  return useQuery({
    queryKey: [
      GUARANTOR_PRODUCT_TYPE_LIMIT_QUERY_KEY.GUARANTOR_PRODUCT_TYPE_LIMIT,
      params?.productId,
      params?.jobGroup,
      params?.isPageAble,
      params?.perPage,
      params?.search,
      params?.page,
    ],
    queryFn: async () => {
      const response = await axios.get(
        route("api.limit-management.guarantor-product-type-limit.search-guarantor-product-type-limit", {
          product_id: params?.productId,
          job_group: params?.jobGroup,
          is_page_able: params?.isPageAble,
          per_page: params?.perPage,
          search: params?.search,
          page: params?.page,
        }),
      );

      return response.data.data as TResponse;
    },
    ...querySetting,
  });
};
