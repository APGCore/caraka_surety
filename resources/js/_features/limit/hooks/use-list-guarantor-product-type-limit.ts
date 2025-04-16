import { PaginationMeta } from "@/_features/_common/types/pagination";
import { JobGroup, useGetAllJobGroup } from "@/_features/job-group/services/job-group-query";
import { useGetAllProduct } from "@/_features/product/services/product-query";
import { useQueryState } from "nuqs";
import React, { useCallback, useEffect } from "react";
import { useSearchProductTypeLimit } from "../services/guarantor-product-type-limit-query";

interface ProductTypeLimit {
  id: number;
  guarantor_id: number;
  no: number;
  code: string;
  full_name: string;
  name: string;
  job_group: string;
  job_type: string;
  created_at: string;
  updated_at: string;
  limit: number | null;
}

export interface ProductTypeLimitResponse {
  data: ProductTypeLimit[];
  meta: PaginationMeta;
}

const useListProductTypeLimit = () => {
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
    defaultValue: "",
    history: "push",
    parse: (value) => value || "",
    serialize: (value) => value,
  });

  const [jobGroup, setJobGroup] = useQueryState("job_group", {
    defaultValue: "",
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

  const initialized = React.useRef(false);

  useEffect(() => {
    if (isSuccessProducts && isSuccessJobGroups && !initialized.current) {
      setProductId((products as { id: number }[])[0].id.toString());
      const firstJobGroup = jobGroups?.[0];
      console.log(firstJobGroup);
      if (firstJobGroup?.id) {
        setJobGroup(firstJobGroup.id.toString());
      }
      initialized.current = true;
    }
  }, [isSuccessProducts, products, isSuccessJobGroups, jobGroups]);

  const {
    data: productTypeLimits,
    isLoading: isLoadingProductTypeLimits,
    isSuccess: isSuccessProductTypeLimits,
  } = useSearchProductTypeLimit<ProductTypeLimitResponse>({
    search,
    perPage: parseInt(perPage),
    page: parseInt(page),
    productId: "1",
    jobGroup: "Konstruksi",
    isPageAble: "true",
  });

  console.log(productTypeLimits);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);

    if (search?.length > 0) {
      setPage("1");
    }
  }, []);

  const handlePerPageChange = useCallback((value: string) => {
    setPerPage(value);
    setPage("1");
    setProductId("");
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPage(page.toString());
    setProductId("");
  }, []);

  const handleProductIdChange = useCallback((value: string) => {
    setProductId(value);
    setPage("1");
  }, []);

  return {
    productTypeLimits: productTypeLimits?.data,
    meta: productTypeLimits?.meta,
    jobGroups,
    products,
    isLoadingJobGroups,
    isSuccessJobGroups,
    isLoadingProducts,
    isSuccessProducts,
    isLoadingProductTypeLimits,
    isSuccessProductTypeLimits,
    search,
    perPage,
    page,
    productId,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
    handleProductIdChange,
  };
};

export default useListProductTypeLimit;
