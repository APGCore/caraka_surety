import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const PRINCIPAL_QUERY_KEY = {
  PRINCIPAL: "principal",
};

export const useGetAllPrincipal = (querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [PRINCIPAL_QUERY_KEY.PRINCIPAL],
    queryFn: async () => {
      const response = await axios.get(route("api.principal-management.principal.all"));
      return response.data.data;
    },
    ...querySetting,
  });
};
