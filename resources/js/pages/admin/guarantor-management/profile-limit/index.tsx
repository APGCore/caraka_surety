import { Combobox } from "@/components/common/combobox";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/SelectLengthDatatable";
import AdminLayout from "@/layouts/admin";
import { getQueryParameter } from "@/lib/get-query-parameter";
import { ProfileLimitsUtils } from "@/pages/admin/guarantor-management/profile-limit/profile-limits.utils";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import ProfileLimitsDatatable from "./_partials/profile-limits-datatable";
import ProfileLimitsHeader from "./_partials/profile-limits-header";
import { ProfileLimitsPageProps } from "./profile-limits.type";

const ProfileLimitsPage: ProfileLimitsPageProps = ({ guarantors, guarantorSelected, profiles }) => {
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

  const getData = (per_page: string, search: string, guarantorId?: number) => {
    router.get(
      route(ProfileLimitsUtils.link.index),
      pickBy({
        per_page,
        search,
        guarantor_id: guarantorId,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteProfileLimit = (profileLimit: any) => {
    router.delete(route(ProfileLimitsUtils.link.destroy, profileLimit.id));
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
            onSelect={(value) => handleSelectGuarantor(value.id)}
          />
        </div>
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchProfileLimit}
          placeholder="Cari Kantor"
        />
      </div>
      <ProfileLimitsDatatable
        profiles={profiles}
        guarantorSelectedId={guarantorSelected}
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
      <ProfileLimitsHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </AdminLayout>
  );
};
