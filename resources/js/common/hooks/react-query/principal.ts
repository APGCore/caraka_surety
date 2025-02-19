import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from "@tanstack/react-query";
import axios from "axios";

export const PRINCIPAL_QUERY_KEY = {
  PRINCIPAL: "principal",
  CREATE_PRINCIPAL: "create-principal",
};

export const useGetAllPrincipal = (querySetting?: UseQueryOptions) => {
  return useQuery({
    queryKey: [PRINCIPAL_QUERY_KEY.PRINCIPAL],
    queryFn: async () => {
      const response = await axios.get(route("api.principal-management.principal.all"));
      return response.data.data;
    },
    ...querySetting,
  });
};

interface Principal {
  province_id?: string;
  regency_id?: string;
  district_id?: string;
  village?: string;
  name?: string;
  address?: string;
  telephone?: string;
  fax?: string;
  postal_code?: string;
  npwp?: string;
  nib?: string;
  siup_siujk?: string;
  head_name?: string;
  director_name?: string;
  director_position?: string;
  director_phone?: string;
  commissioner?: string;
  year_established?: string;
  last_deed?: string;
  business_fields?: string;
}

export const useCreatePrincipal = (mutationSetting: UseMutationOptions<unknown, Error, Principal, unknown> = {}) => {
  return useMutation({
    mutationKey: [PRINCIPAL_QUERY_KEY.CREATE_PRINCIPAL],
    mutationFn: async (data: Principal) => {
      const response = await axios.post(route("api.principal-management.principal.store"), data);
      return response?.data?.data;
    },
    ...mutationSetting, // Ensure mutationSetting is never undefined
  });
};
