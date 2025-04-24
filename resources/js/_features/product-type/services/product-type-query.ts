import { FetchParams } from "@/_features/_common/types/fetch";
import { QuerySetting } from "@/_features/_common/types/react-query";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const PRODUCT_TYPE_QUERY_KEY = {
  SEARCH_PRODUCT_TYPE: "search_product_type",
};

interface SearchProductTypeParams extends FetchParams {
  productId?: string;
}

export const useSearchProductType = <TResponse = unknown>(
  params?: SearchProductTypeParams,
  querySetting?: QuerySetting<TResponse>,
) => {
  return useQuery({
    queryKey: [
      PRODUCT_TYPE_QUERY_KEY.SEARCH_PRODUCT_TYPE,
      params?.perPage,
      params?.search,
      params?.page,
      params?.productId,
    ],
    queryFn: async () => {
      const response = await axios.get(
        route("api.product-type-management.product-type.search-product-type", {
          per_page: params?.perPage,
          search: params?.search,
          page: params?.page,
          is_page_able: params?.isPageAble,
          product_id: params?.productId,
        }),
      );

      return params?.isPageAble !== "false" ? (response.data.data as TResponse) : (response.data.data as TResponse);
    },
    ...querySetting,
  });
};
