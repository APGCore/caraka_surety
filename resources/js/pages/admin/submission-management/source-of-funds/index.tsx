import { getQueryParameter } from "@/common/utils/get-query-parameter";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/select-length-datatable";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { SourceOfFundsUtils } from "@/pages/admin/submission-management/source-of-funds/source-of-funds.utils";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import SourceOfFundsDatatable from "./_partials/source-of-funds-datatable";
import SourceOfFundsHeader from "./_partials/source-of-funds-header";
import { SourceOfFundsPageProps } from "./source-of-founds.type";

const SourceOfFundsPage: SourceOfFundsPageProps = ({ sourceOfFunds }) => {
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");

  const handleSelectLength = (per_page: string) => {
    setSelect(per_page);
    getData(per_page, search);
  };

  const handleSearch = () => {
    getData(select, search);
  };

  const getData = (per_page: string, search: string) => {
    router.get(
      route(SourceOfFundsUtils.link.index),
      pickBy({
        per_page,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteData = (scoring: any) => {
    router.delete(route(SourceOfFundsUtils.link.destroy, scoring.id));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <SelectLengthDatatable defaultValue={select} onChange={handleSelectLength} />
        </div>
        <SearchDatatable value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari Sumber Dana" />
      </div>
      <SourceOfFundsDatatable sourceOfFunds={sourceOfFunds} onDelete={deleteData} />
    </main>
  );
};

export default SourceOfFundsPage;

SourceOfFundsPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <SourceOfFundsHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
