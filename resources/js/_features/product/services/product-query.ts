import { QueryOptions, useQuery } from "@tanstack/react-query";
import axios from "axios";

export const PRODUCT_QUERY_KEY = {
  PRODUCT: "product",
  PRODUCT_TYPE: "product_type",
  PRODUCT_TYPE_BY_PRODUCT_ID_AND_GUARANTOR_ID: "regencyByProvinceId",
  DISTRICT_BY_REGENCY_ID: "districtByRegencyId",
};

export const useGetAllProduct = (guarantorId: number, querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [PRODUCT_QUERY_KEY.PRODUCT, guarantorId],
    queryFn: async () => {
      const response = await axios.get(route("api.product-management.product.all", { guarantor_id: guarantorId }));
      return response.data.data;
    },
    enabled: !!guarantorId,
    ...querySetting,
  });
};

export const useGetAllProductType = (querySetting?: QueryOptions) => {
  return useQuery({
    queryKey: [PRODUCT_QUERY_KEY.PRODUCT_TYPE],
    queryFn: async () => {
      const response = await axios.get(route("api.product-management.product-type.all"));
      return response.data.data;
    },
    ...querySetting,
  });
};

export const useGetProductTypeByProductIdAndGuarantorId = (
  productId?: string,
  guarantorId?: string,
  querySetting?: QueryOptions,
) => {
  return useQuery({
    queryKey: [PRODUCT_QUERY_KEY.PRODUCT_TYPE_BY_PRODUCT_ID_AND_GUARANTOR_ID, productId, guarantorId],
    queryFn: async () => {
      const response = await axios.get(
        route("api.product-management.product-type.from-product-and-guarantor", { productId, guarantorId }),
      );
      return response.data.data;
    },
    enabled: !!productId && !!guarantorId,
    ...querySetting,
  });
};
