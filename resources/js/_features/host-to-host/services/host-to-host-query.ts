import { FetchParams } from "@/_features/_common/types/fetch";
import { QuerySetting } from "@/_features/_common/types/react-query";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const HOST_TO_HOST_QUERY_KEY = {
  SEARCH_HOST_TO_HOST: "searchHostToHost",
  GET_ALL_HOST_TO_HOST: "getAllHostToHost",
};

export const useSearchHostToHost = <TResponse = unknown>(
  params?: FetchParams,
  querySetting?: QuerySetting<TResponse>,
) => {
  return useQuery({
    queryKey: [
      HOST_TO_HOST_QUERY_KEY.SEARCH_HOST_TO_HOST,
      params?.perPage,
      params?.search,
      params?.page,
      params?.isPageAble,
    ],
    queryFn: async () => {
      const response = await axios.get(
        route("api.host-to-host-management.host-to-host.search-host-to-host", {
          per_page: params?.perPage,
          search: params?.search,
          page: params?.page,
          is_page_able: params?.isPageAble,
        }),
      );

      return response.data.data as TResponse;
    },
    ...querySetting,
  });
};
