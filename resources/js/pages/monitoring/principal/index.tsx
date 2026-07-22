import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";
import PrincipalDatatable from "./_partials/principal-datatable";
import PrincipalHeader from "./_partials/principal-page-header";
import { PrincipalPageProps } from "./principal-page.type";

const PrincipalMonitoringPage: PrincipalPageProps = ({ principals }) => {
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(10);

  const getData = (per_page: number, searchValue: string) => {
    router.get(route("monitoring.principal.index"), pickBy({ per_page, search: searchValue }), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(select, search);
  };

  const handleSelect = (value: string) => {
    setSelect(Number(value));
    getData(Number(value), search);
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <SelectLengthDatatable defaultValue={select.toString()} onChange={handleSelect} />
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearch}
          placeholder="Cari Nama Principal"
        />
      </div>
      <PrincipalDatatable principals={principals} />
    </main>
  );
};

export default PrincipalMonitoringPage;

PrincipalMonitoringPage.layout = (page: any) => {
  const pagePropsData = page.props;
  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <PrincipalHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
