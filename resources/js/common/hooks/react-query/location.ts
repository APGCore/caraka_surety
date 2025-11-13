import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const LOCATION_QUERY_KEY = {
  PROVINCE: "province",
  REGENCY: "regency",
  DISTRICT: "district",
  REGENCY_BY_PROVINCE_ID: "regencyByProvinceId",
  DISTRICT_BY_REGENCY_ID: "districtByRegencyId",
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
