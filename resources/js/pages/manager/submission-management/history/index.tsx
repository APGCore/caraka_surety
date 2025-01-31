import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import ManagerLayoutPage from "@/layouts/manager";
import { useState } from "react";
import SubmissionHistoryDatatable from "./_partials/history-datatable";
import SubmissionHistoryHeader from "./_partials/history-page-header";
import { SubmissionHistoryPageProps } from "./history-page.type";

const SubmissionHistoryPage: SubmissionHistoryPageProps = ({ submissions }) => {
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(10);

  console.log(submissions);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleSelect = (value: string) => {
    setSelect(Number(value));
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
        </div>
        <div className="flex gap-x-3">
          <form onSubmit={handleSearch} className="flex items-end gap-x-3">
            <Input
              className="h-full"
              placeholder="Cari Pengajuan"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">Cari</Button>
          </form>
        </div>
      </div>
      <SubmissionHistoryDatatable submissions={submissions} />
    </main>
  );
};

export default SubmissionHistoryPage;

SubmissionHistoryPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <ManagerLayoutPage user={pagePropsData?.auth?.user}>
      <SubmissionHistoryHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </ManagerLayoutPage>
  );
};
