import { Combobox } from "@/components/common/combobox";
import RenderList from "@/components/common/render-list";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/SelectLengthDatatable";
import Show from "@/components/common/show";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminLayout from "@/layouts/admin";
import { getQueryParameter } from "@/lib/get-query-parameter";
import { textCurrency } from "@/lib/text-currency";
import { EmployeeLimitsUtils } from "@/pages/admin/guarantor-management/employee-limit/employee-limits.utils";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";
import EmployeeLimitsDatatable from "./_partials/employee-limits-datatable";
import EmployeeLimitsHeader from "./_partials/employee-limits-header";
import { EmployeeLimitsPageProps } from "./employee-limits.type";

const ProfileLimitsPage: EmployeeLimitsPageProps = ({
  guarantors,
  guarantorSelected,
  guarantorProducts,
  guarantorProductSelected,
  guarantorProductTypes,
  guarantorProductTypeSelected,
  profiles,
  profileSelected,
  officeTypes,
  officeTypeSelected,
  limit,
  employees,
}) => {
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");

  const handleSelectProfileLimitLength = (per_page: string) => {
    setSelect(per_page);
    getData({ per_page, search });
  };

  const handleSearchProfileLimit = () => {
    getData({ per_page: select, search });
  };

  const handleSelectGuarantor = (guarantorId: number) => {
    getData({ per_page: select, search, guarantor_id: guarantorId });
  };

  const handleSelectProfile = (profileId: number) => {
    const data = {
      per_page: select,
      search,
      guarantor_id: guarantorSelected,
      profile_id: profileId,
    };
    getData(data);
  };

  const handleSelectGuarantorProduct = (guarantorProductId: number) => {
    const data = {
      per_page: select,
      search,
      guarantor_id: guarantorSelected,
      guarantor_product_id: guarantorProductId,
      profile_id: profileSelected,
    };
    getData(data);
  };

  const handleSelectOfficeType = (officeType: string) => {
    const data = {
      per_page: select,
      search,
      guarantor_id: guarantorSelected,
      guarantor_product_id: guarantorProductSelected,
      guarantor_product_type_id: guarantorProductTypeSelected,
      office_type: officeType,
    };
    getData(data);
  };

  const handleSelectGuarantorProductType = (guarantorProductTypeId: number) => {
    const data = {
      per_page: select,
      search,
      guarantor_id: guarantorSelected,
      guarantor_product_id: guarantorProductSelected,
      guarantor_product_type_id: guarantorProductTypeId,
      office_type: officeTypeSelected,
      profile_id: profileSelected,
    };
    getData(data);
  };

  const getData = (data: {
    per_page: string;
    search: string;
    guarantor_id?: number;
    guarantor_product_id?: number;
    guarantor_product_type_id?: number;
    profile_id?: number;
  }) => {
    router.get(route(EmployeeLimitsUtils.link.index), pickBy(data), { preserveState: true, preserveScroll: true });
  };

  const deleteProfileLimit = (profileLimit: any) => {
    router.delete(route(EmployeeLimitsUtils.link.destroy, profileLimit.id));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex items-center gap-x-2">
        <span className="text-sm text-gray-400">Batas Kewenangan Nilai Jaminan:</span>
        {limit?.limit ? (
          <span className="text-sm text-gray-600">Rp. {textCurrency(limit?.limit)}</span>
        ) : (
          <span className="text-sm text-gray-400">Belum Di setting</span>
        )}
      </div>
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <SelectLengthDatatable defaultValue={select} onChange={handleSelectProfileLimitLength} />
        </div>
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchProfileLimit}
          placeholder="Cari Pengguna"
        />
      </div>
      <div className="flex gap-x-3 items-center w-full">
        <Combobox
          datas={guarantors}
          labelKey={"name"}
          valueKey={"name"}
          defaultValueId={guarantorSelected}
          placeholder={"Pilih Penjamin"}
          className={"min-w-[140px]"}
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
          className={"min-w-[140px]"}
          isWidthSameWithInput={false}
          shortValue={true}
          onSelect={(value) => handleSelectGuarantorProduct(value.id)}
        />
        <Combobox
          datas={guarantorProductTypes}
          labelKey={"full_name"}
          valueKey={"full_name"}
          defaultValueId={guarantorProductTypeSelected}
          placeholder={"Pilih Jenis Jaminan"}
          className={"min-w-[160px]"}
          isWidthSameWithInput={false}
          shortValue={true}
          onSelect={(value) => handleSelectGuarantorProductType(value.id)}
        />
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
        <Show when={officeTypeSelected !== officeTypes[0]}>
          <Combobox
            datas={profiles}
            labelKey={"name"}
            valueKey={"name"}
            defaultValueId={profileSelected}
            placeholder={"Pilih Kantor"}
            className={"min-w-[140px]"}
            isWidthSameWithInput={false}
            shortValue={true}
            onSelect={(value) => handleSelectProfile(value.id)}
          />
        </Show>
      </div>
      <EmployeeLimitsDatatable
        employees={employees}
        guarantorSelectedId={guarantorSelected}
        guarantorProductSelectedId={guarantorProductSelected}
        guarantorProductTypeSelectedId={guarantorProductTypeSelected}
        profileSelectedId={profileSelected}
        onDelete={deleteProfileLimit}
      />
    </main>
  );
};

export default ProfileLimitsPage;

ProfileLimitsPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <EmployeeLimitsHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </AdminLayout>
  );
};
