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

const ProfileLimitsPage: ProfileLimitsPageProps = ({
  guarantors,
  guarantorSelected,
  guarantorProducts,
  guarantorProductSelected,
  guarantorProductTypes,
  guarantorProductTypeSelected,
  profiles,
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

  const handleSelectGuarantorProduct = (guarantorProductId: number) => {
    getData(select, search, guarantorSelected, guarantorProductId);
  };
  const handleSelectGuarantorProductType = (guarantorProductTypeId: number) => {
    getData(select, search, guarantorSelected, guarantorProductSelected, guarantorProductTypeId);
  };

  const getData = (
    per_page: string,
    search: string,
    guarantorId?: number,
    guarantorProductId?: number,
    guarantorProductTypeId?: number,
  ) => {
    router.get(
      route(ProfileLimitsUtils.link.index),
      pickBy({
        per_page,
        search,
        guarantor_id: guarantorId,
        guarantor_product_id: guarantorProductId,
        guarantor_product_type_id: guarantorProductTypeId,
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
          <Combobox
            datas={guarantorProducts}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={guarantorProductSelected}
            placeholder={"Pilih Produk"}
            className={"w-min-[210px]"}
            onSelect={(value) => handleSelectGuarantorProduct(value.id)}
          />
          <Combobox
            datas={guarantorProductTypes}
            labelKey={"full_name"}
            valueKey={"full_name"}
            defaultValue={guarantorProductTypeSelected}
            placeholder={"Pilih Jenis Jaminan"}
            className={"w-min-[210px]"}
            onSelect={(value) => handleSelectGuarantorProductType(value.id)}
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
        guarantorProductId={guarantorProductSelected}
        guarantorProductTypeId={guarantorProductTypeSelected}
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
