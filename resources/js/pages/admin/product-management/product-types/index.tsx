import { getQueryParameter } from "@/common/utils/get-query-parameter";
import ExportDocsButtonDatatable from "@/components/molecules/datatable/export";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import ProductTypeDatatable from "./_partials/product-type-datatable";
import ProductTypeHeader from "./_partials/product-type-header";
import { AdminProductTypesPageProps } from "./product-types.type";

const AdminProductTypesPage: AdminProductTypesPageProps = ({ productTypes }) => {
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") ?? "");

  const getProductTypeWithQueryParams = (per_page: string, search: string) => {
    router.get(
      route("product-types.index"),
      pickBy({
        per_page,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const handleSelectProductTypeLength = (per_page: string) => {
    setSelect(per_page);
    getProductTypeWithQueryParams(per_page, search);
  };

  const handleSearchProductType = () => {
    getProductTypeWithQueryParams(select, search);
  };

  const deleteProductType = (productType: any) => {
    router.delete(route("product-types.destroy", productType.id));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <ExportDocsButtonDatatable onClick={() => {}} />
          <SelectLengthDatatable defaultValue={select} onChange={handleSelectProductTypeLength} />
        </div>
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchProductType}
          placeholder="Cari Jenis Produk"
        />
      </div>
      <ProductTypeDatatable productTypes={productTypes} onDelete={deleteProductType} />
    </main>
  );
};

export default AdminProductTypesPage;

AdminProductTypesPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <ProductTypeHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
