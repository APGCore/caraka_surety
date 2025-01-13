import { PaginationDatatable } from "@/components/common/pagination-datatable";
import RenderList from "@/components/common/render-list";
import { ShowingCountDatatable } from "@/components/common/showing-count-datatable";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";

interface InvoiceDatatableProps {
  invoices: any;
}

const InvoiceDatatable: React.FC<InvoiceDatatableProps> = ({ invoices }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">NO</TableHead>
            <TableHead>NO REG BLANGKO</TableHead>
            <TableHead>NO. JAMINAN</TableHead>
            <TableHead>NAMA PRINCIPAL</TableHead>
            <TableHead>OBLIGEE</TableHead>
            <TableHead>PROJECT</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={invoices?.data}
            render={(invoice: any, index: number) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoices?.meta?.from + index}</TableCell>
                <TableCell>{invoice.blank?.number}</TableCell>
                <TableCell>{invoice.no_guarantee}</TableCell>
                <TableCell>{invoice.principal?.name}</TableCell>
                <TableCell>{invoice.obligee?.name}</TableCell>
                <TableCell></TableCell>
                <TableCell className="text-right">
                  <Button>Detail</Button>
                </TableCell>
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
      <ShowingCountDatatable meta={invoices?.meta} />
      <PaginationDatatable meta={invoices?.meta} only={["scorings"]} />
    </>
  );
};

export default InvoiceDatatable;
