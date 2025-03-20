import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const BANK_QUERY_KEY = {
  BANK: "bank",
};

export const useGetAllBank = (querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [BANK_QUERY_KEY.BANK],
    queryFn: async () => {
      const response = await axios.get(route("api.bank-management.bank.all"));
      return response.data.data;
    },
    ...querySetting,
  });
};
