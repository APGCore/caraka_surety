import { FetchParams } from "@/_features/_common/types/fetch";
import { QuerySetting } from "@/_features/_common/types/react-query";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const GUARANTOR_QUERY_KEY = {
  SEARCH_GUARANTOR: "searchGuarantor",
  GET_ALL_GUARANTOR: "getAllGuarantor",
};

interface SearchGuarantorsParams extends FetchParams {
  isHead?: "true" | "false";
  isPageAble?: "true" | "false";
}

export const useSearchGuarantors = <TResponse = unknown>(
  params?: SearchGuarantorsParams,
  querySetting?: QuerySetting<TResponse>,
) => {
  return useQuery({
    queryKey: [
      GUARANTOR_QUERY_KEY.SEARCH_GUARANTOR,
      params?.perPage,
      params?.search,
      params?.page,
      params?.isHead,
      params?.isPageAble,
    ],
    queryFn: async () => {
      const response = await axios.get(
        route("api.guarantor-management.guarantor.search-guarantor", {
          per_page: params?.perPage,
          search: params?.search,
          page: params?.page,
          is_head: params?.isHead,
          is_page_able: params?.isPageAble,
        }),
      );

      return response.data.data as TResponse;
    },
    ...querySetting,
  });
};
