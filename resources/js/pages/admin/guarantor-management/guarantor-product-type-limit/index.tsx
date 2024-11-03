import { Combobox } from "@/components/common/combobox";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/SelectLengthDatatable";
import AdminLayout from "@/layouts/admin";
import { getQueryParameter } from "@/lib/get-query-parameter";
import { textCurrency } from "@/lib/text-currency";
import GuarantorProductTypeRateDatatable from "@/pages/admin/guarantor-management/guarantor-product-type-limit/_partials/guarantor-product-type-rate-datatable";
import GuarantorProductTypeRateHeader from "@/pages/admin/guarantor-management/guarantor-product-type-limit/_partials/guarantor-product-type-rate-header";
import { GuarantorProductTypeRateUtils } from "@/pages/admin/guarantor-management/guarantor-product-type-limit/guarantor-product-type-rate.utils";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import { GuarantorProductTypeRatePageProps } from "./guarantor-product-type-rate.type";

const GuarantorRatePage: GuarantorProductTypeRatePageProps = ({
  guarantors,
  guarantorSelected,
  products,
  productSelected,
  limit,
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
      route(GuarantorProductTypeRateUtils.link.index),
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
          onSubmit={handleSearchProduct}
          placeholder="Cari Jenis Produk"
        />
      </div>
      <GuarantorProductTypeRateDatatable guarantorProductTypes={guarantorProductTypes} />
    </main>
  );
};

export default GuarantorRatePage;

GuarantorRatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <GuarantorProductTypeRateHeader
        title={pagePropsData?.page_settings?.title}
        guarantor={pagePropsData?.guarantor}
      />
      {page}
    </AdminLayout>
  );
};
