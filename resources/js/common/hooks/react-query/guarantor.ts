import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const GUARANTOR_QUERY_KEY = {
  GUARANTOR: "guarantor",
  GUARANTOR_BY_PRODUCT: "guarantor_by_product",
  BRANCH_GUARANTOR: "branch_guarantor",
  BRANCH_GUARANTOR_BY_HEADQUARTER: "branch_guarantor_by_head",
};

export const useFetchGetAllGuarantor = (params: any, querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [GUARANTOR_QUERY_KEY.GUARANTOR, params && typeof params === "object" ? JSON.stringify(params) : params],
    queryFn: async () => {
      const response = await axios.get(route("api.guarantor-management.guarantor.all"), { params });

      return response.data.data;
    },
    ...querySetting,
  });
};

export const useGetGuarantorByProductId = (productId?: string, querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [GUARANTOR_QUERY_KEY.GUARANTOR_BY_PRODUCT, productId],
    queryFn: async () => {
      const response = await axios.get(route("api.guarantor-management.guarantor.by-product", { product: productId }));

      return response.data.data;
    },
    enabled: !!productId,
    ...querySetting,
  });
};

export const useGetAllBranchGuarantor = (querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [GUARANTOR_QUERY_KEY.BRANCH_GUARANTOR],
    queryFn: async () => {
      const response = await axios.get(route("api.guarantor-management.guarantor.all-branch"));
      return response.data.data;
    },
    ...querySetting,
  });
};

export const useGetBranchGuarantorByHeadquarter = (headquarterId?: string, querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [GUARANTOR_QUERY_KEY.BRANCH_GUARANTOR_BY_HEADQUARTER, headquarterId],
    queryFn: async () => {
      const response = await axios.get(
        route("api.guarantor-management.guarantor.branch-from-headquarter", { guarantor: headquarterId }),
      );
      return response.data.data;
    },
    enabled: !!headquarterId,
    ...querySetting,
  });
};
