import { getQueryParameter } from "@/common/utils/get-query-parameter";
import ExportDocsButtonDatatable from "@/components/molecules/datatable/export";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import ProductDatatable from "./_partials/product-datatable";
import ProductHeader from "./_partials/product-header";
import { AdminProductsPageProps } from "./products.type";

const AdminProductsPage: AdminProductsPageProps = ({ products }) => {
    const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
    const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");

    const handleSelectProduct = (per_page: string) => {
        setSelect(per_page);
        getData(per_page, search);
    };

    const handleSearchProduct = () => {
        getData(select, search);
    };

    const getData = (per_page: string, search: string) => {
        router.get(
            route("products.index"),
            pickBy({
                per_page,
                search,
            }),
            { preserveState: true, preserveScroll: true },
        );
    };

    const deleteProduct = (product: any) => {
        router.delete(route("products.destroy", product.id));
    };

    return (
        <main className="space-y-2.5">
            <div className="flex justify-between items-end">
                <div className="flex gap-x-3">
                    <ExportDocsButtonDatatable onClick={() => {}} />
                    <SelectLengthDatatable defaultValue={select} onChange={handleSelectProduct} />
                </div>
                <SearchDatatable
                    value={search}
                    onChange={setSearch}
                    onSubmit={handleSearchProduct}
                    placeholder="Cari Produk"
                />
            </div>
            <ProductDatatable products={products} onDelete={deleteProduct} />
        </main>
    );
};

export default AdminProductsPage;

AdminProductsPage.layout = (page: any) => {
    const pagePropsData = page.props;

    return (
        <RoleBasedLayout propsData={pagePropsData}>
            <ProductHeader title={pagePropsData?.page_settings?.title} />
            {page}
        </RoleBasedLayout>
    );
};
