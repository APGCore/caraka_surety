import { formatCurrency } from "@/common/utils/format-currency";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import React from "react";

interface SubmissionDatatableProps {
  submissions: any;
}

const SubmissionDatatable: React.FC<SubmissionDatatableProps> = ({ submissions }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">NO</TableHead>
            <TableHead>TANGGAL PENGAJUAN</TableHead>
            <TableHead>NO REG BLANGKO</TableHead>
            <TableHead>NO. JAMINAN</TableHead>
            <TableHead>NAMA PRINCIPAL</TableHead>
            <TableHead>NILAI JAMINAN</TableHead>
            <TableHead>PRODUK</TableHead>
            <TableHead>JENIS JAMINAN</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={submissions?.data}
            render={(submission: any, index: number) => (
              <>
                <TableRow key={submission.id}>
                  <TableCell>{submissions?.meta?.from + index}</TableCell>
                  <TableCell>{submission.created_at}</TableCell>
                  <TableCell>{submission.blank?.number}</TableCell>
                  <TableCell>{submission.no_guarantee}</TableCell>
                  <TableCell>{submission.principal?.name}</TableCell>
                  <TableCell>{formatCurrency(submission.guarantee_value)}</TableCell>
                  <TableCell>{submission.product?.name}</TableCell>
                  <TableCell>{submission.product_type?.name}</TableCell>
                </TableRow>
              </>
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
      <ShowingCountDatatable meta={submissions?.meta} />
      <PaginationDatatable meta={submissions?.meta} />
    </>
  );
};

export default SubmissionDatatable;
