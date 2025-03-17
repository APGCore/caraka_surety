import { getQueryParameter } from "@/common/utils/get-query-parameter";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import ProductHeader from "@/pages/admin/product-management/products/_partials/product-header";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import ScoringDatatable from "./_partials/scoring-datatable";
import { AdminScoringsPageProps } from "./scoring.type";

const AdminScoringsPage: AdminScoringsPageProps = ({ scorings }) => {
    const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
    const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");

    const handleSelectSkoringLength = (per_page: string) => {
        setSelect(per_page);
        getData(per_page, search);
    };

    const handleSearchSkoring = () => {
        getData(select, search);
    };

    const getData = (per_page: string, search: string) => {
        router.get(
            route("scoring.index"),
            pickBy({
                per_page,
                search,
            }),
            { preserveState: true, preserveScroll: true },
        );
    };

    const deleteSkoring = (scoring: any) => {
        router.delete(route("scoring.destroy", scoring.id));
    };

    return (
        <main className="space-y-2.5">
            <div className="flex justify-between items-end">
                <div className="flex gap-x-3">
                    <SelectLengthDatatable defaultValue={select} onChange={handleSelectSkoringLength} />
                </div>
                <SearchDatatable
                    value={search}
                    onChange={setSearch}
                    onSubmit={handleSearchSkoring}
                    placeholder="Cari Skoring"
                />
            </div>
            <ScoringDatatable scorings={scorings} onDelete={deleteSkoring} />
        </main>
    );
};

export default AdminScoringsPage;

AdminScoringsPage.layout = (page: any) => {
    const pagePropsData = page.props;

    return (
        <RoleBasedLayout propsData={pagePropsData}>
            <ProductHeader title={pagePropsData?.page_settings?.title} />
            {page}
        </RoleBasedLayout>
    );
};
