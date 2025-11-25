import NewCombobox from "@/_features/_common/components/combobox";
import { getQueryParameter } from "@/common/utils/get-query-parameter";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_shadcn-ui/select";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import OfficeRateDatatable from "@/pages/tariff-management/office-rate/_partials/office-rate-datatable";
import OfficeRateHeader from "@/pages/tariff-management/office-rate/_partials/office-rate-header";
import { OfficeRateUtils } from "@/pages/tariff-management/office-rate/office-rate.utils";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";
import { OfficeRatePageProps } from "./office-rate.type";

const OfficeRatePage: OfficeRatePageProps = ({
  offices,
  officeTypes,
  officeSelected,
  officeTypeSelected,
  guarantors,
  guarantorSelected,
  guarantorBranches,
  guarantorBranchSelected,
  products,
  productSelected,
  jobGroups,
  jobGroupSelected,
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

  const handleSelectOfficeType = (officeType: string) => {
    getData(select, search, officeType, undefined, guarantorSelected, guarantorBranchSelected, productSelected);
  };

  const handleSelectOffice = (officeId: number) => {
    getData(select, search, officeTypeSelected, officeId, guarantorSelected, guarantorBranchSelected, productSelected);
  };

  const handleSelectGuarantor = (guarantorId: number) => {
    getData(select, search, officeTypeSelected, officeSelected, guarantorId);
  };

  const handleSelectProduct = (productId: number) => {
    getData(select, search, officeTypeSelected, officeSelected, guarantorSelected, guarantorBranchSelected, productId);
  };

  const handleSelectJobGroup = (jobGroup: string) => {
    getData(
      select,
      search,
      officeTypeSelected,
      officeSelected,
      guarantorSelected,
      guarantorBranchSelected,
      productSelected,
      jobGroup,
    );
  };

  const getData = (
    per_page: string,
    search: string,
    officeType?: string,
    officeId?: number,
    guarantorId?: number,
    guarantorBranchId?: number,
    productId?: number,
    jobGroup?: string,
    jobType?: string,
  ) => {
    router.get(
      route(OfficeRateUtils.link.index),
      pickBy({
        per_page,
        search,
        office_type: officeType,
        office_id: officeId,
        guarantor_id: guarantorId,
        guarantor_branch_id: guarantorBranchId,
        product_id: productId,
        job_group: jobGroup,
        job_type: jobType,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  // console.log(officeSelected, "officeSelected");

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
      <div className="flex gap-x-3">
        <NewCombobox
          data={guarantors}
          labelKey={"name"}
          valueKey={"id"}
          defaultValue={guarantorSelected}
          placeholder={"Pilih Asuransi"}
          className={"min-w-[160px]"}
          onSelect={(value: any) => handleSelectGuarantor(value.id)}
        />
        {/*<Combobox*/}
        {/*  datas={guarantorBranches}*/}
        {/*  labelKey={"name"}*/}
        {/*  valueKey={"name"}*/}
        {/*  defaultValueId={guarantorBranchSelected}*/}
        {/*  placeholder={"Pilih Cabang Asuransi"}*/}
        {/*  className={"min-w-[160px]"}*/}
        {/*  isSelectFirst={!guarantorBranchSelected}*/}
        {/*  onSelect={(value) => handleSelectGuarantorBranch(value.id)}*/}
        {/*/>*/}
        <Select onValueChange={(value) => handleSelectOfficeType(value)} defaultValue={String(officeTypeSelected)}>
          <SelectTrigger className="min-w-[160px]">
            <SelectValue placeholder="Pilih " />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <RenderList
                of={officeTypes}
                render={(officeType: string) => <SelectItem value={officeType}>{officeType}</SelectItem>}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
        <Show when={officeTypeSelected !== officeTypes[0]}>
          <NewCombobox
            data={offices}
            labelKey={"name"}
            valueKey={"id"}
            defaultValue={officeSelected}
            placeholder={"Pilih Kantor"}
            className={"min-w-[160px]"}
            onSelect={(value: any) => handleSelectOffice(value.id)}
          />
        </Show>
        <NewCombobox
          data={products}
          labelKey={"name"}
          valueKey={"id"}
          defaultValue={productSelected}
          placeholder={"Pilih Produk"}
          className={"min-w-[160px]"}
          onSelect={(value: any) => handleSelectProduct(value.id)}
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
      </div>
      <OfficeRateDatatable
        profileId={officeSelected}
        guarantorId={guarantorSelected}
        guarantorBranchId={guarantorBranchSelected}
        guarantorProductTypes={guarantorProductTypes}
      />
    </main>
  );
};

export default OfficeRatePage;

OfficeRatePage.layout = (page: any) => {
  const pagePropsData = page.props;
  const breadcrumbs = [{ label: "Kelola Tarif Unit Bisnis", href: route(OfficeRateUtils.link.index) }];

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <OfficeRateHeader
        title={pagePropsData?.page_settings?.title}
        description={pagePropsData?.page_settings?.description}
        breadcrumbs={breadcrumbs}
      />
      {page}
    </RoleBasedLayout>
  );
};
