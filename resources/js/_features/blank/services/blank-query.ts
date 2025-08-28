import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const BLANK_QUERY_KEY = {
  GET_ALL_BLANK: "get-all-blank",
};

export const useGetAllBlank = (
  guarantorBranchId: number,
  blankIdForEdit: string | number | null = null,
  querySetting?: QueryOptions,
) => {
  return useQuery({
    queryKey: [BLANK_QUERY_KEY.GET_ALL_BLANK, blankIdForEdit, guarantorBranchId],
    queryFn: async () => {
      const params = blankIdForEdit ? { blank_id_for_edit: blankIdForEdit } : {};
      if (guarantorBranchId) {
        Object.assign(params, { guarantor_branch_id: guarantorBranchId });
      }
      const response = await axios.get(route("api.blank-management.blank.all", params));
      return response.data.data;
    },
    ...querySetting,
  });
};
