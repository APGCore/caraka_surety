import { getQueryParameter } from "@/common/utils/get-query-parameter";
import { Combobox } from "@/components/molecules/combobox";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { DocumentFormatUtils } from "@/pages/admin/documents/format/document-format.utils";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";
import DocumentFormatDatatable from "./_partials/document-format-datatable";
import DocumentFormatHeader from "./_partials/document-format-header";
import { DocumentFormatPageProps } from "./document-format.type";

const DocumentFormatPage: DocumentFormatPageProps = ({
  guarantors,
  guarantorSelected,
  products,
  productSelected,
  guarantorProductTypes,
  guarantorProductTypeSelected,
  documentFormats,
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
    const id = guarantorSelected === guarantorId ? undefined : guarantorId;
    getData(select, search, id);
  };

  const handleSelectGuarantorProduct = (guarantorProductId: number) => {
    const id = productSelected === guarantorProductId ? undefined : guarantorProductId;
    getData(select, search, guarantorSelected, id);
  };
  const handleSelectGuarantorProductType = (guarantorProductTypeId: number) => {
    const id = guarantorProductTypeSelected === guarantorProductTypeId ? undefined : guarantorProductTypeId;
    getData(select, search, guarantorSelected, productSelected, id);
  };

  const getData = (
    per_page: string,
    search: string,
    guarantorId?: number,
    guarantorProductId?: number,
    guarantorProductTypeId?: number,
  ) => {
    router.get(
      route(DocumentFormatUtils.link.index),
      pickBy({
        per_page,
        search,
        guarantor_id: guarantorId,
        guarantor_product_id: guarantorProductId,
        guarantor_to_product_type_id: guarantorProductTypeId,
      }),
    );
  };

  console.log(documentFormats);
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
            className={"w-min-[210px]"}
            shortValue={true}
            onSelect={(value) => handleSelectGuarantorProduct(value.id)}
          />
          <Combobox
            datas={guarantorProductTypes}
            labelKey={"full_name"}
            valueKey={"full_name"}
            defaultValue={guarantorProductTypeSelected}
            placeholder={"Pilih Jenis Jaminan"}
            className={"w-min-[210px]"}
            shortValue={true}
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
      <DocumentFormatDatatable
        documentFormats={documentFormats}
        guarantorSelectedId={guarantorSelected}
        productSelectedId={productSelected}
        guarantorProductTypeId={guarantorProductTypeSelected}
      />
    </main>
  );
};

export default DocumentFormatPage;

DocumentFormatPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <DocumentFormatHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
