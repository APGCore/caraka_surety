import { FetchParams } from "@/_features/_common/types/fetch";
import { QuerySetting } from "@/_features/_common/types/react-query";
import { LOCATION_QUERY_KEY } from "@/common/hooks/react-query/location";
import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { DISTRICT_LOCATION_API_ROUTES } from "../constants/location-route";

export const DISTRICT_LOCATION_QUERY_KEY = {
  SEARCH_DISTRICT: "searchDistrict",
  GET_ALL_DISTRICT: "getAllDistrict",
};

interface SearchDistrictsParams extends FetchParams {
  regency_id?: string;
}

export const useSearchDistricts = <TResponse = unknown>(
  params?: SearchDistrictsParams,
  querySetting?: QuerySetting<TResponse>,
) => {
  return useQuery({
    queryKey: [
      DISTRICT_LOCATION_QUERY_KEY.SEARCH_DISTRICT,
      params?.perPage,
      params?.search,
      params?.page,
      params?.regency_id,
    ],
    queryFn: async () => {
      const response = await axios.get(
        route(DISTRICT_LOCATION_API_ROUTES.SEARCH, {
          per_page: params?.perPage,
          search: params?.search,
          page: params?.page,
          regency_id: params?.regency_id,
        }),
      );

      return response.data.data as TResponse;
    },
    ...querySetting,
  });
};

export const useGetDistrictByRegencyId = (regency_id?: string, querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [LOCATION_QUERY_KEY.DISTRICT_BY_REGENCY_ID, regency_id],
    queryFn: async () => {
      const response = await axios.get(route("api.location-management.district.by-regency", { regency_id }));
      return response.data;
    },
    enabled: !!regency_id,
    ...querySetting,
  });
};
