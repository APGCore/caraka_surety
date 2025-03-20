import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const BLANK_QUERY_KEY = {
  GET_ALL_BLANK: "get-all-blank",
};

export const useGetAllBlank = (querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [BLANK_QUERY_KEY.GET_ALL_BLANK],
    queryFn: async () => {
      const response = await axios.get(route("api.blank-management.blank.all"));
      return response.data.data;
    },
    ...querySetting,
  });
};
