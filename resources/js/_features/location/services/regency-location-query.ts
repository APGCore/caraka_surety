import { FetchParams } from "@/_features/_common/types/fetch";
import { QuerySetting } from "@/_features/_common/types/react-query";
import { LOCATION_QUERY_KEY } from "@/common/hooks/react-query/location";
import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { REGENCY_LOCATION_API_ROUTES } from "../constants/location-route";

export const REGENCY_LOCATION_QUERY_KEY = {
  SEARCH_REGENCY: "searchRegency",
  GET_ALL_REGENCY: "getAllRegency",
};

interface SearchRegenciesParams extends FetchParams {
  province_id?: number;
}

export const useSearchRegencies = <TResponse = unknown>(
  params?: SearchRegenciesParams,
  querySetting?: QuerySetting<TResponse>,
) => {
  return useQuery({
    queryKey: [
      REGENCY_LOCATION_QUERY_KEY.SEARCH_REGENCY,
      params?.perPage,
      params?.search,
      params?.page,
      params?.province_id,
    ],
    queryFn: async () => {
      const response = await axios.get(
        route(REGENCY_LOCATION_API_ROUTES.SEARCH, {
          per_page: params?.perPage,
          search: params?.search,
          page: params?.page,
          province_id: params?.province_id,
        }),
      );
      return response.data.data as TResponse;
    },
    ...querySetting,
  });
};

export const useGetRegencyByProvinceId = (province_id?: string, querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [LOCATION_QUERY_KEY.REGENCY_BY_PROVINCE_ID, province_id],
    queryFn: async () => {
      const response = await axios.get(route("api.location-management.regency.by-province", { province_id }));

      return response.data;
    },
    enabled: !!province_id,
    ...querySetting,
  });
};
