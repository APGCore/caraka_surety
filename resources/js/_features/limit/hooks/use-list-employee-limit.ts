import { PaginationMeta } from "@/_features/_common/types/pagination";
import { useGetAllJobGroup } from "@/_features/job-group/services/job-group-query";
import { useGetOfficeTypes, useSearchOffice } from "@/_features/office/services/office-query";
import { useSearchProductType } from "@/_features/product-type/services/product-type-query";
import { useGetAllProduct } from "@/common/hooks/react-query/product";
import { useQueryState } from "nuqs";
import React, { useCallback } from "react";
import { useSearchEmployeeLimit } from "../services/employee-limit-query";

type OfficeType = "Kantor Pusat" | "Kantor Cabang" | "Mitra Agen" | "Mitra Pemasaran";

type JobGroup = "Konstruksi" | "Non Konstruksi";

export interface EmployeeLimitResponse {
  data: any;
  meta: PaginationMeta;
}

const useListEmployeeLimit = ({
  initialProductId,
  initialProductTypeId,
  initialJobGroup,
  initialOfficeType,
  initialOfficeId,
}: {
  initialProductId: string;
  initialProductTypeId: string;
  initialJobGroup: string;
  initialOfficeType: OfficeType;
  initialOfficeId: string;
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

  const [officeId, setOfficeId] = useQueryState("office_id", {
    defaultValue: initialOfficeId,
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
      isPageAble: "false",
    },
    {
      enabled: !!productId,
    },
  );

  const {
    data: officeTypes,
    isLoading: isLoadingOfficeTypes,
    isSuccess: isSuccessOfficeTypes,
  } = useGetOfficeTypes<OfficeType[]>();

  const {
    data: offices,
    isLoading: isLoadingOffices,
    isSuccess: isSuccessOffices,
  } = useSearchOffice(
    {
      officeType: officeType as OfficeType,
      isPageAble: "false",
    },
    {
      enabled: !!officeType,
    },
  );

  const {
    data: employeeLimits,
    isLoading: isLoadingEmployeeLimits,
    isSuccess: isSuccessEmployeeLimits,
  } = useSearchEmployeeLimit<EmployeeLimitResponse>({
    search,
    perPage: parseInt(perPage),
    page: parseInt(page),
    productId,
    productTypeId,
    officeType,
    jobGroup,
    officeId,
    isPageAble: "true",
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

  const handleOfficeIdChange = useCallback((value: string) => {
    setOfficeId(value);
    setPage("1");
  }, []);

  return {
    // employee limits
    employeeLimits: employeeLimits?.data,
    meta: employeeLimits?.meta,
    isLoadingEmployeeLimits,
    isSuccessEmployeeLimits,

    // job groups
    jobGroup,
    jobGroups,
    isLoadingJobGroups,
    isSuccessJobGroups,

    // products
    productId,
    products,
    isLoadingProducts,
    isSuccessProducts,

    // product types
    productTypeId,
    productTypes,
    isLoadingProductTypes,
    isSuccessProductTypes,

    // search
    search,
    perPage,
    page,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,

    // handle product id change
    handleProductIdChange,
    handleProductTypeIdChange,
    handleJobGroupChange,

    // office types
    officeType,
    officeTypes,
    isLoadingOfficeTypes,
    isSuccessOfficeTypes,
    handleOfficeTypeChange,

    // offices
    officeId,
    offices,
    isLoadingOffices,
    isSuccessOffices,
    handleOfficeIdChange,
  };
};

export default useListEmployeeLimit;
