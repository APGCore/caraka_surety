import { PaginationMeta } from "@/_features/_common/types/pagination";
import { useGetAllJobGroup } from "@/_features/job-group/services/job-group-query";
import { useGetOfficeTypes } from "@/_features/office/services/office-query";
import { useSearchProductType } from "@/_features/product-type/services/product-type-query";
import { useGetAllProduct } from "@/_features/product/services/product-query";
import { useQueryState } from "nuqs";
import React, { useCallback } from "react";
import { useSearchOfficeLimit } from "../services/office-limit-query";

type Office = {
  id: number;
  name: string;
  office_name: string;
  limit: number;
  limit_inherit: number;
  profile_limit_id?: number;
  product_type: string;
  created_at: string; // You could use `Date` if it's parsed
};

type GuarantorProductTypeLimit = {
  id: number;
  guarantor_id: number;
  guarantor_to_product_type_id: number;
  limit: number;
  limit_inherit: number;
  created_at: string; // or Date if parsed
  updated_at: string; // or Date if parsed
  product_type_name: string;
};

export interface OfficeLimitResponse {
  data: {
    profiles: Office[];
    guarantorProductTypeLimit: GuarantorProductTypeLimit;
  };
  meta: PaginationMeta;
}

type OfficeType = "Kantor Pusat" | "Kantor Cabang" | "Mitra Agen" | "Mitra Pemasaran";

type JobGroup = "Konstruksi" | "Non Konstruksi";

const useOfficeLimit = ({
  initialGuarantorId,
  initialProductId,
  initialProductTypeId,
  initialJobGroup,
  initialOfficeType,
}: {
  initialGuarantorId: string;
  initialProductId: string;
  initialProductTypeId: string;
  initialJobGroup: JobGroup;
  initialOfficeType: OfficeType;
}) => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    history: "push",
    parse: (value) => decodeURIComponent(value || ""),
    serialize: (value) => encodeURIComponent(value || ""),
  });

  const [perPage, setPerPage] = useQueryState("per_page", {
    defaultValue: "10",
    history: "push",
    parse: (value) => value || "10",
    serialize: (value) => value,
  });

  const [page, setPage] = useQueryState("page", {
    defaultValue: "1",
    history: "push",
    parse: (value) => value || "1",
    serialize: (value) => value,
  });

  const [productId, setProductId] = useQueryState("product_id", {
    defaultValue: initialProductId,
    history: "push",
    parse: (value) => value || "",
    serialize: (value) => value,
  });

  const [guarantorId, setGuarantorId] = useQueryState("guarantor_id", {
    defaultValue: initialGuarantorId,
    history: "push",
    parse: (value) => value || "",
    serialize: (value) => value,
  });

  const [productTypeId, setProductTypeId] = useQueryState("product_type_id", {
    defaultValue: initialProductTypeId,
    history: "push",
    parse: (value) => value || "",
    serialize: (value) => value,
  });

  const [officeType, setOfficeType] = useQueryState("office_type", {
    defaultValue: initialOfficeType,
    history: "push",
    parse: (value) => value || "",
    serialize: (value) => value,
  });

  const [jobGroup, setJobGroup] = useQueryState("job_group", {
    defaultValue: initialJobGroup,
    history: "push",
    parse: (value) => value || "",
    serialize: (value) => value,
  });

  const {
    data: jobGroups,
    isLoading: isLoadingJobGroups,
    isSuccess: isSuccessJobGroups,
  } = useGetAllJobGroup<JobGroup[]>();

  const { data: products, isLoading: isLoadingProducts, isSuccess: isSuccessProducts } = useGetAllProduct(1);

  const {
    data: productTypes,
    isLoading: isLoadingProductTypes,
    isSuccess: isSuccessProductTypes,
  } = useSearchProductType(
    {
      productId,
      guarantorId,
      isPageAble: "false",
    },
    {
      enabled: !!productId && !!guarantorId,
    },
  );

  const {
    data: officeTypes,
    isLoading: isLoadingOfficeTypes,
    isSuccess: isSuccessOfficeTypes,
  } = useGetOfficeTypes<OfficeType[]>();

  const {
    data: officeLimits,
    isLoading: isLoadingOfficeLimits,
    isSuccess: isSuccessOfficeLimits,
  } = useSearchOfficeLimit<OfficeLimitResponse>({
    search,
    perPage: parseInt(perPage),
    page: parseInt(page),
    productId,
    productTypeId,
    officeType,
    jobGroup,
  });

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    if (search?.length > 0) {
      setPage("1");
    }
  }, []);

  const handlePerPageChange = useCallback((value: string) => {
    setPerPage(value);
    setPage("1");
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPage(page.toString());
  }, []);

  const handleProductIdChange = useCallback((value: string) => {
    setProductId(value);
    setPage("1");
  }, []);

  const handleProductTypeIdChange = useCallback((value: string) => {
    setProductTypeId(value);
    setPage("1");
  }, []);

  const handleOfficeTypeChange = useCallback((value: OfficeType) => {
    setOfficeType(value);
    setPage("1");
  }, []);

  const handleJobGroupChange = useCallback((value: string) => {
    setJobGroup(value);
    setPage("1");
  }, []);

  return {
    officeLimits: officeLimits?.data,
    meta: officeLimits?.meta,
    isLoadingOfficeLimits,
    isSuccessOfficeLimits,
    jobGroups,
    isLoadingJobGroups,
    isSuccessJobGroups,
    products,
    isLoadingProducts,
    isSuccessProducts,
    productTypes,
    isLoadingProductTypes,
    isSuccessProductTypes,
    search,
    perPage,
    page,
    productId,
    productTypeId,
    officeType,
    jobGroup,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
    handleProductIdChange,
    handleProductTypeIdChange,
    handleOfficeTypeChange,
    handleJobGroupChange,
    officeTypes,
    isLoadingOfficeTypes,
    isSuccessOfficeTypes,
  };
};

export default useOfficeLimit;
