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
import { Combobox } from "@/components/molecules/combobox";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import GuarantorRateDatatable from "@/pages/tariff-management/guarantor-rate/_partials/guarantor-rate-datatable";
import GuarantorRateHeader from "@/pages/tariff-management/guarantor-rate/_partials/guarantor-rate-header";
import { GuarantorRateUtils } from "@/pages/tariff-management/guarantor-rate/guarantor-rate.utils";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import { GuarantorRatePageProps } from "./guarantor-rate.type";

const GuarantorRatePage: GuarantorRatePageProps = ({
  guarantors,
  guarantorSelected,
  // guarantorBranches,
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

  const handleSelectGuarantor = (guarantorId: number) => {
    getData(select, search, guarantorId);
  };

  // const handleSelectGuarantorBranch = (guarantorBranchId: number) => {
  //   getData(select, search, guarantorSelected, guarantorBranchId);
  // };

  const handleSelectProduct = (productId: number) => {
    getData(select, search, guarantorSelected, guarantorBranchSelected, productId);
  };

  const handleSelectJobGroup = (jobGroup: string) => {
    getData(select, search, guarantorSelected, guarantorBranchSelected, productSelected, jobGroup);
  };

  const getData = (
    per_page: string,
    search: string,
    guarantorId?: number,
    guarantorBranchId?: number,
    productId?: number,
    jobGroup?: string,
    jobType?: string,
  ) => {
    router.get(
      route(GuarantorRateUtils.link.index),
      pickBy({
        per_page,
        search,
        guarantor_id: guarantorId,
        guarantor_branch_id: guarantorBranchId,
        product_id: productId,
        job_group: jobGroup,
        job_type: jobType,
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
      <div className="flex gap-x-3">
        <Combobox
          datas={guarantors}
          labelKey={"name"}
          valueKey={"name"}
          defaultValue={guarantorSelected}
          placeholder={"Pilih Asuransi"}
          className={"min-w-[160px]"}
          onSelect={(value) => handleSelectGuarantor(value.id)}
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
        <Combobox
          datas={products}
          labelKey={"name"}
          valueKey={"name"}
          defaultValue={productSelected}
          placeholder={"Pilih Produk"}
          className={"min-w-[160px]"}
          shortValue={true}
          onSelect={(value) => handleSelectProduct(value.id)}
        />
        <div>
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
      </div>
      <GuarantorRateDatatable
        guarantorId={guarantorSelected}
        guarantorBranchId={guarantorBranchSelected}
        guarantorProductTypes={guarantorProductTypes}
      />
    </main>
  );
};

export default GuarantorRatePage;

GuarantorRatePage.layout = (page: any) => {
  const pagePropsData = page.props;
  const breadcrumbs = [{ label: "Kelola Asuransi", href: route(GuarantorRateUtils.link.index) }];

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <GuarantorRateHeader title={pagePropsData?.page_settings?.title} breadcrumbs={breadcrumbs} />
      {page}
    </RoleBasedLayout>
  );
};
