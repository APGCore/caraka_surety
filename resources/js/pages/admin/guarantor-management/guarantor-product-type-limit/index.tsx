import { getQueryParameter } from "@/common/utils/get-query-parameter";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/_shadcn-ui/select";
import RenderList from "@/components/atoms/render-list";
import { Combobox } from "@/components/molecules/combobox";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import GuarantorProductTypeRateDatatable
    from "@/pages/admin/guarantor-management/guarantor-product-type-limit/_partials/guarantor-product-type-rate-datatable";
import GuarantorProductTypeRateHeader
    from "@/pages/admin/guarantor-management/guarantor-product-type-limit/_partials/guarantor-product-type-rate-header";
import {
    GuarantorProductTypeRateUtils
} from "@/pages/admin/guarantor-management/guarantor-product-type-limit/guarantor-product-type-rate.utils";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";
import { GuarantorProductTypeRatePageProps } from "./guarantor-product-type-rate.type";

const GuarantorRatePage: GuarantorProductTypeRatePageProps = ({
  guarantors,
  guarantorSelected,
  products,
  productSelected,
  jobGroups,
  jobGroupSelected,
  jobTypes,
  jobTypeSelected,
  guarantorProductTypes,
}) => {
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");

  const handleSelectProfileLimitLength = (per_page: string) => {
    setSelect(per_page);
    getData(per_page, search);
  };

  const handleSearchProduct = () => {
    getData(select, search);
  };

  const handleSelectGuarantor = (guarantorId: number) => {
    getData(select, search, guarantorId);
  };

  const handleSelectProduct = (productId: number) => {
    getData(select, search, guarantorSelected, productId);
  };

  const handleSelectJobGroup = (jobGroup: string) => {
    getData(select, search, guarantorSelected, productSelected, jobGroup);
  };

  const handleSelectJobType = (jobType: string) => {
    getData(select, search, guarantorSelected, productSelected, jobGroupSelected, jobType);
  };

  const getData = (
    per_page: string,
    search: string,
    guarantorId?: number,
    productId?: number,
    jobGroup?: string,
    jobType?: string,
  ) => {
    router.get(
      route(GuarantorProductTypeRateUtils.link.index),
      pickBy({
        per_page,
        search,
        guarantor_id: guarantorId,
        product_id: productId,
        job_group: jobGroup,
        // job_type: jobType,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <SelectLengthDatatable defaultValue={select} onChange={handleSelectProfileLimitLength} />
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchProduct}
          placeholder="Cari Jenis Produk"
        />
      </div>
      <div className="flex gap-x-3 items-center max-w-[50%]">
        <Combobox
          datas={guarantors}
          labelKey={"name"}
          valueKey={"name"}
          defaultValueId={guarantorSelected}
          placeholder={"Pilih Asuransi"}
          className={"min-w-[200px]"}
          isWidthSameWithInput={false}
          shortValue={true}
          onSelect={(value) => handleSelectGuarantor(value.id)}
        />
        <Combobox
          datas={products}
          labelKey={"name"}
          valueKey={"name"}
          defaultValueId={productSelected}
          placeholder={"Pilih Produk"}
          className={"min-w-[200px]"}
          isWidthSameWithInput={false}
          shortValue={true}
          onSelect={(value) => handleSelectProduct(value.id)}
        />
        <Select onValueChange={(value) => handleSelectJobGroup(value)} defaultValue={jobGroupSelected}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih Kelompok Pekarjaan" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <RenderList
                of={jobGroups}
                render={(jobGroup: string) => <SelectItem value={jobGroup}>{jobGroup}</SelectItem>}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
        {/*<Select onValueChange={(value) => handleSelectJobType(value)} defaultValue={jobTypeSelected}>*/}
        {/*  <SelectTrigger>*/}
        {/*    <SelectValue placeholder="Pilih Jenis Pekerjaan" />*/}
        {/*  </SelectTrigger>*/}
        {/*  <SelectContent>*/}
        {/*    <SelectGroup>*/}
        {/*      <RenderList*/}
        {/*        of={jobTypes}*/}
        {/*        render={(jobType: string) => <SelectItem value={jobType}>{jobType}</SelectItem>}*/}
        {/*      />*/}
        {/*    </SelectGroup>*/}
        {/*  </SelectContent>*/}
        {/*</Select>*/}
      </div>
      <GuarantorProductTypeRateDatatable guarantorProductTypes={guarantorProductTypes} />
    </main>
  );
};

export default GuarantorRatePage;

GuarantorRatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <GuarantorProductTypeRateHeader
        title={pagePropsData?.page_settings?.title}
        guarantor={pagePropsData?.guarantor}
      />
      {page}
    </RoleBasedLayout>
  );
};
