import FilterOffice from "@/_features/_common/components/filter-office";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import RenderList from "@/components/atoms/render-list";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import SubmissionHistoryDatatable from "@/pages/kepala-cabang/submission-management/history/_partials/history-datatable";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";
import SubmissionHistoryHeader from "./_partials/history-page-header";
import { SubmissionHistoryPageProps } from "./history-page.type";

const SubmissionHistoryPage: SubmissionHistoryPageProps = ({
  submissions,
  offices,
  officeTypes,
  officeSelected,
  officeTypeSelected,
}) => {
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(10);
  const [statusSelectedState, setStatusSelectedState] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(select, search, statusSelectedState, officeTypeSelected, officeSelected);
  };

  const handleSelect = (value: string) => {
    setSelect(Number(value));
    getData(Number(value), search, statusSelectedState, officeTypeSelected, officeSelected);
  };

  const handleStatus = (value: string) => {
    setStatusSelectedState(value);
    getData(select, search, value, officeTypeSelected, officeSelected);
  };

  const handleSelectOfficeType = (officeType: string) => {
    getData(select, search, statusSelectedState, officeType, undefined);
  };

  const handleSelectOffice = (officeId: number) => {
    getData(select, search, statusSelectedState, officeTypeSelected, officeId);
  };

  const handleReset = () => {
    setSelect(10);
    setSearch("");
    getData(10, "", statusSelectedState, undefined, undefined);
  };

  const getData = (
    per_page: number,
    search: string,
    status: string | undefined,
    officeTypeSelected: string | undefined,
    officeSelected: number | undefined,
  ) => {
    router.get(
      route("kepala-cabang-submission-history.submission"),
      pickBy({
        per_page,
        search,
        status_selected: status,
        office_type: officeTypeSelected,
        office_id: officeSelected,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex space-x-2">
          <SelectLengthDatatable defaultValue={select.toString()} onChange={handleSelect} />
          <Select
            value={statusSelectedState}
            onValueChange={(val) => {
              handleStatus(val);
            }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <RenderList
                of={status as any}
                render={(status: string) => <SelectItem value={status}>{String(status).toUpperCase()}</SelectItem>}
              />
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
        <SearchDatatable value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari Nomor Pengajuan" />
      </div>
      <SubmissionHistoryDatatable submissions={submissions} />
    </main>
  );
};

export default SubmissionHistoryPage;

SubmissionHistoryPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <SubmissionHistoryHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
