import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/_features/_common/components/_shadcn-ui/card";
import { getQueryParameter } from "@/_features/_common/utils/get-query-parameter";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import GuarantorRateHeader from "../_partials/guarantor-rate-header";
import GuarantorRateListDatatable from "../_partials/guarantor-rate-list-datatable";
import { GuarantorRateUtils } from "../guarantor-rate.utils";
import { ListRatePageProps } from "./guarantor-rate-list.type";

const GuarantorRateList: ListRatePageProps = ({
  guarantorSelected,
  guarantorBranchSelected,
  guarantorToProductTypeSelected,
  guarantorRates,
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
      route(GuarantorRateUtils.link.list),
      pickBy({
        per_page,
        search,
        guarantor_id: guarantorSelected,
        guarantor_branch_id: guarantorBranchSelected,
        guarantor_to_product_type_id: guarantorToProductTypeSelected,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };
  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <SelectLengthDatatable defaultValue={select} onChange={handleSelectLimitLength} />
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
                route(GuarantorRateUtils.link.create, {
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
      <GuarantorRateListDatatable guarantorRates={guarantorRates} />
    </main>
  );
};

export default GuarantorRateList;

GuarantorRateList.layout = (page: any) => {
  const pagePropsData = page.props;
  const breadcrumbs = [
    { label: "Kelola Asuransi", href: route(GuarantorRateUtils.link.index) },
    {
      label: pagePropsData?.page_settings?.title,
      href: route(GuarantorRateUtils.link.list, {
        guarantor_id: pagePropsData.guarantorSelected,
        guarantor_to_product_type_id: pagePropsData.guarantorToProductTypeSelected,
      }),
    },
  ];
  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <GuarantorRateHeader title={pagePropsData?.page_settings?.title} breadcrumbs={breadcrumbs} />
      {page}
    </RoleBasedLayout>
  );
};
