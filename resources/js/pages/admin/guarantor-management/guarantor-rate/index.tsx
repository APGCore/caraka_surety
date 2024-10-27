import { Combobox } from "@/components/common/combobox";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/SelectLengthDatatable";
import AdminLayout from "@/layouts/admin";
import { getQueryParameter } from "@/lib/get-query-parameter";
import GuarantorRateDatatable from "@/pages/admin/guarantor-management/guarantor-rate/_partials/guarantor-rate-datatable";
import GuarantorRateHeader from "@/pages/admin/guarantor-management/guarantor-rate/_partials/guarantor-rate-header";
import { GuarantorRateUtils } from "@/pages/admin/guarantor-management/guarantor-rate/guarantor-rate.utils";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import { GuarantorRatePageProps } from "./guarantor-rate.type";

const GuarantorRatePage: GuarantorRatePageProps = ({
  guarantors,
  guarantorSelected,
  products,
  productSelected,
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

  const getData = (per_page: string, search: string, guarantorId?: number, productId?: number) => {
    router.get(
      route(GuarantorRateUtils.link.index),
      pickBy({
        per_page,
        search,
        guarantor_id: guarantorId,
        product_id: productId,
      }),
      { preserveState: true, preserveScroll: true },
    );
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
            datas={products}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={productSelected}
            placeholder={"Pilih Produk"}
            className={"w-[210px]"}
            shortValue={true}
            onSelect={(value) => handleSelectProduct(value.id)}
          />
        </div>
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchProduct}
          placeholder="Cari Jenis Produk"
        />
      </div>
      <GuarantorRateDatatable guarantorProductTypes={guarantorProductTypes} />
    </main>
  );
};

export default GuarantorRatePage;

GuarantorRatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <GuarantorRateHeader title={pagePropsData?.page_settings?.title} guarantor={pagePropsData?.guarantor} />
      {page}
    </AdminLayout>
  );
};
