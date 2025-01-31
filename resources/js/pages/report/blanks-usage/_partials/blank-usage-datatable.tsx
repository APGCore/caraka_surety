import { Button } from "@/components/_shadcn-ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import { PaginationDatatable } from "@/components/common/pagination-datatable";
import RenderList from "@/components/common/render-list";
import { ShowingCountDatatable } from "@/components/common/showing-count-datatable";
import React from "react";

interface BlankUsageDatatableProps {
  BlankUsages: any;
}

const BlankUsageDatatable: React.FC<BlankUsageDatatableProps> = ({ BlankUsages }) => {
  console.log(BlankUsages);
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">NO</TableHead>
            <TableHead>NO REG BLANGKO</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>KANTOR CABANG</TableHead>
            {/* <TableHead className="text-right">Aksi</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={BlankUsages?.data}
            render={(BlankUsage: any, index: number) => (
              <TableRow key={BlankUsage.id}>
                <TableCell>{BlankUsages?.meta?.from + index}</TableCell>
                <TableCell>{BlankUsage?.number}</TableCell>
                <TableCell>{BlankUsage?.status}</TableCell>
                <TableCell>{BlankUsage?.profile?.name}</TableCell>
                <TableCell></TableCell>
                {/* <TableCell className="text-right">
                  <Button>Detail</Button>
                </TableCell> */}
              </TableRow>
            )}
            renderFallback={() => (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          />
        </TableBody>
      </Table>
      <ShowingCountDatatable meta={BlankUsages?.meta} />
      <PaginationDatatable meta={BlankUsages?.meta} only={["scorings"]} />
    </>
  );
};

export default BlankUsageDatatable;
