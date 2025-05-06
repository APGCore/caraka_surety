import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
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

const SubmissionHistoryPage: SubmissionHistoryPageProps = ({ submissions, status, statusSelected }) => {
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState("10");
  const [statusSelectedState, setStatusSelectedState] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(parseInt(select), search, statusSelected);
  };

  const handleSelect = (value: string) => {
    setSelect(value);
    getData(parseInt(value), search, statusSelected);
  };

  const handleStatus = (value: string) => {
    setStatusSelectedState(value);
    getData(parseInt(select), search, value);
  };

  const getData = (per_page: number, search: string, status: string) => {
    router.get(
      route("kepala-cabang-submission-history.submission"),
      pickBy({
        per_page,
        search,
        status_selected: status,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex space-x-2">
          <SelectLengthDatatable defaultValue={select} onChange={handleSelect} />
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
        </div>
        {/*<SearchDatatable value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari Pengajuan" />*/}
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
