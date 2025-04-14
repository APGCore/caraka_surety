import { QuerySetting } from "@/_features/_common/types/react-query";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const JOB_GROUP_QUERY_KEY = {
  GET_ALL_JOB_GROUP: "getAllJobGroup",
};

export const useGetAllJobGroup = <TResponse = unknown>(querySetting?: QuerySetting<TResponse>) => {
  return useQuery({
    queryKey: [JOB_GROUP_QUERY_KEY.GET_ALL_JOB_GROUP],
    queryFn: async () => {
      const response = await axios.get(route("api.job-group-management.job-group.get-all"));

      return response.data.data as TResponse;
    },
    ...querySetting,
  });
};
