import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const OBLIGEE_QUERY_KEY = {
  OBLIGEE: "obligee",
  OBLIGEE_BY_NAME: "obligee_by_name",
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

export const useSearchObligeeByName = ({ search, querySetting }: { search?: string; querySetting?: QueryOptions }) => {
  return useQuery({
    queryKey: [OBLIGEE_QUERY_KEY.OBLIGEE_BY_NAME, search],
    queryFn: async () => {
      const response = await axios.get(
        route("api.obligee-management.obligee.search-by-name", { search: search ?? "" }),
      );
      return response.data.data;
    },
    ...querySetting,
  });
};
