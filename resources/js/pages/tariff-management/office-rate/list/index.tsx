import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { getQueryParameter } from "@/_features/_common/utils/get-query-parameter";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import OfficeRateHeader from "../_partials/office-rate-header";
import OfficeRateListDatatable from "../_partials/office-rate-list-datatable";
import { OfficeRateUtils } from "../office-rate.utils";
import { ListRatePageProps } from "./office-rate-list.type";

const GuarantorRateList: ListRatePageProps = ({
  profileSelected,
  officeTypeSelected,
  guarantorSelected,
  guarantorBranchSelected,
  guarantorToProductTypeSelected,
  productSelected,
  jobGroupSelected,
  profileRates,
}) => {
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");

  const handleSelectLimitLength = (per_page: string) => {
    setSelect(per_page);
    getData(per_page, search);
  };

  const handleSearchProduct = () => {
    getData(select, search);
  };

  const getData = (per_page: string, search: string) => {
    router.get(
      route(OfficeRateUtils.link.list),
      pickBy({
        per_page,
        search,
        profile_id: profileSelected,
        guarantor_id: guarantorSelected,
        guarantor_branch_id: guarantorBranchSelected,
        guarantor_to_product_type_id: guarantorToProductTypeSelected,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const handleBack = () => {
    router.get(
      route(OfficeRateUtils.link.index),
      pickBy({
        office_id: profileSelected,
        office_type: officeTypeSelected,
        product_id: productSelected,
        guarantor_id: guarantorSelected,
        guarantor_branch_id: guarantorBranchSelected,
        job_group: jobGroupSelected,
      }),
    );
  };
  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3 items-center">
          <Button onClick={handleBack}>Kembali</Button>
          <SelectLengthDatatable defaultValue={select} onChange={handleSelectLimitLength} />
        </div>
        <div className="flex gap-x-3 items-center">
          <SearchDatatable
            value={search}
            onChange={setSearch}
            onSubmit={handleSearchProduct}
            placeholder="Cari Tarif Asuransi"
          />
          <Button
            variant="success"
            onClick={() =>
              router.get(
                route(OfficeRateUtils.link.create, {
                  profile_id: profileSelected,
                  guarantor_id: guarantorSelected,
                  guarantor_branch_id: guarantorBranchSelected,
                  guarantor_to_product_type_id: guarantorToProductTypeSelected,
                }),
              )
            }>
            Tambah Tarif
          </Button>
        </div>
      </div>
      <OfficeRateListDatatable profileRates={profileRates} />
    </main>
  );
};

export default GuarantorRateList;

GuarantorRateList.layout = (page: any) => {
  const pagePropsData = page.props;
  const breadcrumbs = [
    { label: "Kelola Tarif Unit Bisnis", href: route(OfficeRateUtils.link.index) },
    {
      label: pagePropsData?.page_settings?.title,
      href: route(OfficeRateUtils.link.list, {
        profile_id: pagePropsData.profileSelected,
        guarantor_id: pagePropsData.guarantorSelected,
        guarantor_to_product_type_id: pagePropsData.guarantorToProductTypeSelected,
      }),
    },
  ];

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
