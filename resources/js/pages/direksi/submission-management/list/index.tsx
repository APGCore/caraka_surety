import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import SubmissionListDatatable from "./_partials/list-datatable";
import SubmissionListHeader from "./_partials/list-page-header";
import { SubmissionListPageProps } from "./list-page.type";
import DireksiLayoutPage from "@/layouts/direksi";

const SubmissionListPage: SubmissionListPageProps = ({ submissions }) => {
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(10);

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
      <SubmissionListDatatable submissions={submissions} />
    </main>
  );
};

export default SubmissionListPage;

SubmissionListPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <DireksiLayoutPage user={pagePropsData?.auth?.user}>
      <SubmissionListHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </DireksiLayoutPage>
  );
};
