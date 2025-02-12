import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const OBLIGEE_QUERY_KEY = {
  OBLIGEE: "obligee",
};

export const useGetAllObligee = (querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [OBLIGEE_QUERY_KEY.OBLIGEE],
    queryFn: async () => {
      const response = await axios.get(route("api.obligee-management.obligee.all"));
      return response.data.data;
    },
    ...querySetting,
  });
};
