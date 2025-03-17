import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import SubmissionHistoryDatatable from "./_partials/history-datatable";
import SubmissionHistoryHeader from "./_partials/history-page-header";
import { SubmissionHistoryPageProps } from "./history-page.type";

const SubmissionHistoryPage: SubmissionHistoryPageProps = ({ submissions }) => {
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState("10");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(parseInt(select), search);
  };

  const handleSelect = (value: string) => {
    setSelect(value);
    getData(parseInt(value), search);
  };

  const getData = (per_page: number, search: string) => {
    router.get(
      route("staff-submission-history.submission"),
      pickBy({
        per_page,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <SelectLengthDatatable defaultValue={select} onChange={handleSelect} />
        <SearchDatatable value={search} onChange={setSearch} onSubmit={handleSearch} placeholder="Cari Pengajuan" />
      </div>
      <SubmissionHistoryDatatable submissions={submissions} onDelete={() => {}} />
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
