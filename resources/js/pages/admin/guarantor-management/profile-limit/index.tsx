import useOfficeLimit from "@/_features/limit/hooks/use-list-office-limit";
import ListOfficeLimitPage from "@/_features/limit/pages/list-office-limit-page";
import { useSearchOfficeLimit } from "@/_features/limit/services/office-limit-query";
import { getQueryParameter } from "@/common/utils/get-query-parameter";
import { textCurrency } from "@/common/utils/text-currency";
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
import { ProfileLimitsUtils } from "@/pages/admin/guarantor-management/profile-limit/profile-limits.utils";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";
import ProfileLimitsDatatable from "./_partials/profile-limits-datatable";
import ProfileLimitsHeader from "./_partials/profile-limits-header";
import { ProfileLimitsPageProps } from "./profile-limits.type";

const ProfileLimitsPage: ProfileLimitsPageProps = ({
  guarantors,
  guarantorSelected,
  guarantorProducts,
  guarantorProductSelected,
  guarantorProductTypes,
  guarantorProductTypeSelected,
  guarantorToProductTypeId,
  jobGroups,
  jobGroupSelected,
  jobTypes,
  jobTypeSelected,
  officeTypes,
  officeTypeSelected,
  limit,
  profiles,
}) => {
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");

  // const { data: officeLimits } = useSearchOfficeLimit({
  //   search: "",
  //   jobGroup: "Konstruksi",
  //   officeType: "Kantor Cabang",
  //   productId: "1",
  //   productTypeId: "1",
  // });

  // const {
  //   officeLimits,
  //   productId,
  //   productTypeId,
  //   officeType,
  //   products,
  //   productTypes,
  //   jobGroups: j,
  // } = useOfficeLimit({
  //   initialProductId: "1",
  //   initialProductTypeId: "1",
  //   initialJobGroup: "Konstruksi",
  //   initialOfficeType: "Kantor Cabang",
  // });

  // console.log({
  //   officeLimits,
  //   products,
  //   productTypes,
  //   jobGroups: j,
  // });

  const handleSelectProfileLimitLength = (per_page: string) => {
    setSelect(per_page);
    getData(per_page, search);
  };

  const handleSearchProfileLimit = () => {
    getData(select, search);
  };

  const handleSelectGuarantor = (guarantorId: number) => {
    getData(select, search, guarantorId);
  };

  const handleSelectGuarantorProduct = (guarantorProductId: number) => {
    getData(select, search, guarantorSelected, guarantorProductId);
  };
  const handleSelectGuarantorProductType = (guarantorProductTypeId: number) => {
    getData(select, search, guarantorSelected, guarantorProductSelected, guarantorProductTypeId);
  };

  const handleSelectJobGroup = (jobGroup: string) => {
    getData(select, search, guarantorSelected, guarantorProductSelected, guarantorProductTypeSelected, jobGroup);
  };

  const handleSelectJobType = (jobType: string) => {
    getData(
      select,
      search,
      guarantorSelected,
      guarantorProductSelected,
      guarantorProductTypeSelected,
      jobGroupSelected,
      jobType,
    );
  };

  const handleSelectOfficeType = (officeType: string) => {
    getData(
      select,
      search,
      guarantorSelected,
      guarantorProductSelected,
      guarantorProductTypeSelected,
      jobGroupSelected,
      jobTypeSelected,
      officeType,
    );
  };

  const getData = (
    per_page: string,
    search: string,
    guarantorId?: number,
    guarantorProductId?: number,
    guarantorProductTypeId?: number,
    jobGroup?: string,
    jobType?: string,
    officeType?: string,
  ) => {
    router.get(
      route(ProfileLimitsUtils.link.index),
      pickBy({
        per_page,
        search,
        guarantor_id: guarantorId,
        guarantor_product_id: guarantorProductId,
        guarantor_product_type_id: guarantorProductTypeId,
        job_group: jobGroup,
        job_type: jobType,
        office_type: officeType,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteProfileLimit = (profileLimit: any) => {
    router.delete(route(ProfileLimitsUtils.link.destroy, profileLimit.id));
  };

  // return <ListOfficeLimitPage />;

  return (
    <main className="space-y-2.5">
      <div className="flex flex-col gap-x-2">
        <div>
          <span className="text-sm text-gray-400">Batas Kewenangan Nilai Jaminan: </span>
          {limit?.limit ? (
            <span className="text-sm text-gray-600">Rp. {textCurrency(limit?.limit)}</span>
          ) : (
            <span className="text-sm text-gray-400">Belum Di setting</span>
          )}
        </div>

        <div>
          <span className="text-sm text-gray-400">Batas Kewenangan Nilai Jaminan Turunan: </span>
          {limit?.limit_inherit ? (
            <span className="text-sm text-gray-600">Rp. {textCurrency(limit?.limit_inherit)}</span>
          ) : (
            <span className="text-sm text-gray-400">Belum Di setting</span>
          )}
        </div>
      </div>
      <div className="flex justify-between items-end">
        <SelectLengthDatatable defaultValue={select} onChange={handleSelectProfileLimitLength} />
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchProfileLimit}
          placeholder="Cari Kantor"
        />
      </div>
      <div className="flex items-center gap-x-2 w-full">
        <Combobox
          datas={guarantors}
          labelKey={"name"}
          valueKey={"name"}
          defaultValueId={guarantorSelected}
          placeholder={"Pilih Penjamin"}
          className={"min-w-[200px]"}
          isWidthSameWithInput={false}
          shortValue={true}
          onSelect={(value) => handleSelectGuarantor(value.id)}
        />
        <Combobox
          datas={guarantorProducts}
          labelKey={"name"}
          valueKey={"name"}
          defaultValueId={guarantorProductSelected}
          placeholder={"Pilih Produk"}
          className={"min-w-[200px]"}
          isWidthSameWithInput={false}
          shortValue={true}
          onSelect={(value) => handleSelectGuarantorProduct(value.id)}
        />
        <Combobox
          datas={guarantorProductTypes}
          labelKey={"name"}
          valueKey={"name"}
          defaultValueId={guarantorProductTypeSelected}
          placeholder={"Pilih Jenis Jaminan"}
          className={"min-w-[200px]"}
          isWidthSameWithInput={false}
          shortValue={true}
          onSelect={(value) => handleSelectGuarantorProductType(value.id)}
        />
        <Select defaultValue={jobGroupSelected} onValueChange={(val) => handleSelectJobGroup(val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Jenis Pekerjaan" />
          </SelectTrigger>
          <SelectContent>
            <RenderList
              of={jobGroups}
              render={(jobGroup: string) => <SelectItem value={jobGroup}>{jobGroup}</SelectItem>}
            />
          </SelectContent>
        </Select>
        <Select defaultValue={jobTypeSelected} onValueChange={(val) => handleSelectJobType(val)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tipe Pekerjaan" />
          </SelectTrigger>
          <SelectContent>
            <RenderList
              of={jobTypes}
              render={(jobType: string) => <SelectItem value={jobType}>{jobType}</SelectItem>}
            />
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => handleSelectOfficeType(value)} defaultValue={String(officeTypeSelected)}>
          <SelectTrigger>
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
      </div>
      <ProfileLimitsDatatable
        profiles={profiles}
        guarantorSelectedId={guarantorSelected}
        guarantorProductId={guarantorProductSelected}
        guarantorProductTypeId={guarantorProductTypeSelected}
        guarantorToProductTypeId={guarantorToProductTypeId}
        jobGroupSelected={jobGroupSelected}
        jobTypeSelected={jobTypeSelected}
        onDelete={deleteProfileLimit}
      />
    </main>
  );
};

export default ProfileLimitsPage;

ProfileLimitsPage.layout = (page: any) => {
  const pagePropsData = page.props;

  const title = "Batas Kewenangan Nilai Jaminan Unit Kantor";

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <ProfileLimitsHeader title={title} />
      {page}
    </RoleBasedLayout>
  );
};
