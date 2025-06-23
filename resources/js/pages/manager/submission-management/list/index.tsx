import FilterOffice from "@/_features/_common/components/filter-office";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";
import SubmissionListDatatable from "./_partials/list-datatable";
import SubmissionListHeader from "./_partials/list-page-header";
import { SubmissionListPageProps } from "./list-page.type";

const SubmissionListPage: SubmissionListPageProps = ({
  submissions,
  offices,
  officeTypes,
  officeSelected,
  officeTypeSelected,
}) => {
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(10);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(select, search, officeTypeSelected, officeSelected);
  };

  const handleSelect = (value: string) => {
    setSelect(Number(value));
    getData(Number(value), search, officeTypeSelected, officeSelected);
  };

  const handleSelectOfficeType = (officeType: string) => {
    getData(select, search, officeType, undefined);
  };

  const handleSelectOffice = (officeId: number) => {
    getData(select, search, officeTypeSelected, officeId);
  };

  const handleReset = () => {
    setSelect(10);
    setSearch("");
    getData(10, "", undefined, undefined);
  };

  const getData = (
    per_page: number,
    search: string,
    officeTypeSelected: string | undefined,
    officeSelected: number | undefined,
  ) => {
    router.get(
      route("manager-submission-list.submission"),
      pickBy({
        per_page,
        search,
        office_type: officeTypeSelected,
        office_id: officeSelected,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <Select onValueChange={handleSelect} defaultValue={String(select)}>
            <SelectTrigger className="w-max">
              <SelectValue placeholder="Items per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <FilterOffice
            offices={offices}
            officeTypes={officeTypes}
            officeTypeSelected={officeTypeSelected}
            officeSelected={officeSelected}
            handleSelectOfficeType={handleSelectOfficeType}
            handleSelectOffice={handleSelectOffice}
            handleReset={handleReset}
          />
        </div>
        <div className="w-[30%]">
          <SearchDatatable
            value={search}
            onChange={setSearch}
            onSubmit={handleSearch}
            placeholder="Cari Nomor Pengajuan atau Principal"
          />
        </div>
      </div>
      <SubmissionListDatatable submissions={submissions} />
    </main>
  );
};

export default SubmissionListPage;

SubmissionListPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <SubmissionListHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
