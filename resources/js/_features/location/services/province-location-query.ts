import { FetchParams } from "@/_features/_common/types/fetch";
import { QuerySetting } from "@/_features/_common/types/react-query";
import { LOCATION_QUERY_KEY } from "@/common/hooks/react-query/location";
import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PROVINCE_LOCATION_API_ROUTES } from "../constants/location-route";

export const PROVINCE_LOCATION_QUERY_KEY = {
  SEARCH_PROVINCE: "searchProvince",
  GET_ALL_PROVINCE: "getAllProvince",
};

export const useSearchProvinces = <TResponse = unknown>(
  params: FetchParams,
  querySetting?: QuerySetting<TResponse>,
) => {
  return useQuery({
    queryKey: [PROVINCE_LOCATION_QUERY_KEY.SEARCH_PROVINCE, params?.perPage, params?.search, params?.page],
    queryFn: async () => {
      const response = await axios.get(
        route(PROVINCE_LOCATION_API_ROUTES.SEARCH, {
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

export const useGetAllProvince = (querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [LOCATION_QUERY_KEY.PROVINCE],
    queryFn: async () => {
      const response = await axios.get(route("api.location-management.province.all"));
      return response.data;
    },
    ...querySetting,
  });
};
