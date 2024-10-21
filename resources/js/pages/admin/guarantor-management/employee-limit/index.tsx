import { Combobox } from "@/components/common/combobox";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/SelectLengthDatatable";
import AdminLayout from "@/layouts/admin";
import { getQueryParameter } from "@/lib/get-query-parameter";
import { textCurrency } from "@/lib/text-currency";
import { EmployeeLimitsUtils } from "@/pages/admin/guarantor-management/employee-limit/employee-limits.utils";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import EmployeeLimitsDatatable from "./_partials/employee-limits-datatable";
import EmployeeLimitsHeader from "./_partials/employee-limits-header";
import { EmployeeLimitsPageProps } from "./employee-limits.type";

const ProfileLimitsPage: EmployeeLimitsPageProps = ({
  guarantors,
  guarantorSelected,
  profiles,
  profileSelected,
  limit,
  employees,
}) => {
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");

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

  const handleSelectProfile = (profileId: number) => {
    getData(select, search, guarantorSelected, profileId);
  };

  const getData = (per_page: string, search: string, guarantorId?: number, profileId?: number) => {
    router.get(
      route(EmployeeLimitsUtils.link.index),
      pickBy({
        per_page,
        search,
        guarantor_id: guarantorId,
        profile_id: profileId,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteProfileLimit = (profileLimit: any) => {
    router.delete(route(EmployeeLimitsUtils.link.destroy, profileLimit.id));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <SelectLengthDatatable defaultValue={select} onChange={handleSelectProfileLimitLength} />
          <Combobox
            datas={guarantors}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={guarantorSelected}
            placeholder={"Pilih Penjamin"}
            className={"w-[210px]"}
            shortValue={true}
            onSelect={(value) => handleSelectGuarantor(value.id)}
          />
          <Combobox
            datas={profiles}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={profileSelected}
            placeholder={"Pilih Kantor"}
            className={"w-[210px]"}
            shortValue={true}
            onSelect={(value) => handleSelectProfile(value.id)}
          />
          <div>
            <div className="flex items-center gap-x-2">
              <span className="text-sm text-gray-400">Limit Pengajuan:</span>
              {limit?.limit ? (
                <span className="text-sm text-gray-600">Rp. {textCurrency(limit?.limit)}</span>
              ) : (
                <span className="text-sm text-gray-400">Belum Di setting</span>
              )}
            </div>
            <div className="flex items-center gap-x-2">
              <span className="text-sm text-gray-400">Limit yang sudah dibagikan:</span>
              {limit?.limit_used ? (
                <span className="text-sm text-gray-600">Rp. {textCurrency(limit?.limit_used)}</span>
              ) : (
                <span className="text-sm text-gray-400">Belum Ada</span>
              )}
            </div>
          </div>
        </div>
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchProfileLimit}
          placeholder="Cari Karyawan"
        />
      </div>
      <EmployeeLimitsDatatable
        employees={employees}
        guarantorSelectedId={guarantorSelected}
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
