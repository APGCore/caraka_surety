import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";

interface Activity {
  id: number;
  username: string;
  judul: string;
  description: string;
  subject_type: string;
  event: string | null;
  causer_type: string;
  causer_id: number;
  created_at: string;
}

const ActivityTable = ({ activities, meta }: { activities: Activity[]; meta: any }) => {
  const [select, setSelect] = useState<number>(10);
  const [search, setSearch] = useState<string>("");

  const handleSelect = (e: string) => {
    setSelect(Number(e));
    getData(e, search);
  };

  const handleSearchNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(String(select), search);
  };

  const getData = (perPage: string, search: string) => {
    console.log("getData");
    return router.get(
      route("activity-log.index"),
      pickBy({
        per_page: perPage,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <Select onValueChange={(e) => handleSelect(e)} defaultValue={String(select)}>
            <SelectTrigger className="w-max">
              <SelectValue placeholder="Theme" />
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
          <form onSubmit={(e) => handleSearchNew(e)} className="flex items-end gap-x-3">
            <Input placeholder="Cari Aktivitas" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type="submit">Cari</Button>
          </form>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead>Username</TableHead>
            <TableHead>Judul</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Dilakukan Pada</TableHead>
            {/* <TableHead>Subject Type</TableHead>
          <TableHead>Event</TableHead>
          <TableHead>Causer Type</TableHead>
          <TableHead>Causer ID</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={activities}
            render={(activity, index: number) => (
              <TableRow key={activity.id}>
                <TableCell>{Number(meta.from) + index}</TableCell>
                <TableCell>{activity.username}</TableCell>
                <TableCell>{activity.judul}</TableCell>
                <TableCell>{activity.description}</TableCell>
                <TableCell>{activity.created_at}</TableCell>
                {/* <TableCell>{activity.subject_type}</TableCell> */}
                {/* <TableCell>{activity.event || "-"}</TableCell> */}
                {/* <TableCell>{activity.causer_type}</TableCell> */}
                {/* <TableCell>{activity.causer_id}</TableCell> */}
              </TableRow>
            )}
            renderFallback={() => (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          />
        </TableBody>
      </Table>
      <ShowingCountDatatable meta={meta} />
      <PaginationDatatable meta={meta} />
    </div>
  );
};

export default ActivityTable;
