import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const SUBMISSION_QUERY_KEY = {
  GET_BEFORE: "get-before",
};

interface Params {
  principal_id?: string;
  guarantor_id?: string;
  product_type_id?: string;
  job_group?: string;
  job_type?: string;
}

export const useGetBeforeSubmission = (params?: Params, querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [
      SUBMISSION_QUERY_KEY.GET_BEFORE,
      params?.principal_id,
      params?.guarantor_id,
      params?.product_type_id,
      params?.job_group,
      params?.job_type,
    ],
    queryFn: async () => {
      const response = await axios.get(route("api.submission.submission-before", { ...params }));
      return response.data.data;
    },
    enabled:
      !!params?.principal_id &&
      !!params?.guarantor_id &&
      !!params?.product_type_id &&
      !!params?.job_group &&
      !!params?.job_type,
    ...querySetting,
  });
};
