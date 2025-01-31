import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetAllBank = (querySetting = {}) => {
  return useQuery({
    queryKey: ["bank"],
    queryFn: async () => {
      const response = await axios.get(route("api.bank-management.bank.all"));
      return response.data.data;
    },
    ...querySetting,
  });
};
