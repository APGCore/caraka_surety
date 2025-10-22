import Show from "@/_features/_common/components/show";
import { cn } from "@/common/utils/cn";
import { formatCurrency } from "@/common/utils/format-currency";
import { Badge } from "@/components/_shadcn-ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { SubmissionStatus } from "@/types/submission-status";
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
            <TableHead>NO REG BLANGKO</TableHead>
            <TableHead>NO. JAMINAN</TableHead>
            <TableHead>NAMA PRINCIPAL</TableHead>
            <TableHead>NILAI JAMINAN</TableHead>
            <TableHead>PRODUK</TableHead>
            <TableHead>JENIS JAMINAN</TableHead>
            <TableHead>TANGGAL DIBUAT</TableHead>
            <TableHead>TANGGAL APPROVED</TableHead>
            <TableHead>TANGGAL KIRIM ASURANSI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={submissions?.data}
            render={(submission: any, index: number) => (
              <>
                <TableRow
                  key={submission.id}
                  className={cn(
                    submission.status == SubmissionStatus.REVISED && "bg-yellow-100",
                    submission.status === SubmissionStatus.REVISED + "-plus" && "bg-green-100",
                    submission.status === SubmissionStatus.REVISED + "-minus" && "bg-red-100",
                  )}>
                  <TableCell>{submissions?.meta?.from + index}</TableCell>
                  <TableCell className={"text-center"}>
                    <h3>{submission.blank?.number ?? "X".repeat(10)}</h3>
                    <Show when={submission.blank?.is_broken}>
                      <Badge variant="destructive">Rusak</Badge>
                    </Show>
                    <Show when={submission.submission_before != null}>
                      <Badge variant="warning">Revisi Dari {submission.submission_before?.blank?.number}</Badge>
                    </Show>
                  </TableCell>
                  <TableCell>{submission.no_guarantee}</TableCell>
                  <TableCell>{submission.principal?.name ?? "-"}</TableCell>
                  <TableCell>
                    {formatCurrency(
                      submission.guarantee_value,
                      submission.status === SubmissionStatus.REVISED + "-minus",
                    )}
                  </TableCell>
                  <TableCell>{submission.product?.name ?? "-"}</TableCell>
                  <TableCell>{submission.product_type?.full_name ?? "-"}</TableCell>
                  <TableCell>{submission.created_at}</TableCell>
                  <TableCell>{submission.approved_at}</TableCell>
                  <TableCell>{submission.send_to_guarantor_at ?? "-"}</TableCell>
                </TableRow>
              </>
            )}
            renderFallback={() => (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
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
