import Show from "@/_features/_common/components/show";
import { formatCurrency } from "@/_features/_common/utils/format-currency";
import { Button } from "@/components/_shadcn-ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { SubmissionStatus } from "@/types/submission-status";
import { Link } from "@inertiajs/react";
import React from "react";

interface SubmissionDatatableProps {
  submissions: any;
}

const SubmissionDatatable: React.FC<SubmissionDatatableProps> = ({ submissions }) => {
  console.log("submissions", submissions);
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead>Unit Bisnis</TableHead>
            <TableHead>Perusahaan</TableHead>
            <TableHead>Tipe Produk</TableHead>
            <TableHead>Nomor Jaminan</TableHead>
            <TableHead>Nilai Jaminan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={submissions.data}
            render={(submission: any, index: number) => (
              <TableRow key={submission.id}>
                <TableCell>{submissions.meta.from + index}</TableCell>
                <TableCell>{submission.office?.name}</TableCell>
                <TableCell>{submission?.principal?.name}</TableCell>
                <TableCell>{submission?.guarantor_to_product_type?.full_name}</TableCell>
                <TableCell>{submission.no_guarantee}</TableCell>
                <TableCell>{formatCurrency(submission?.guarantee_value)}</TableCell>
                <TableCell>
                  <p
                    className={`py-1 uppercase text-xs font-semibold rounded text-center ${
                      submission.status === SubmissionStatus.APPROVED
                        ? "bg-green-100 text-green-800"
                        : submission.status === SubmissionStatus.REJECTED ||
                            submission.status === SubmissionStatus.BROKEN
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {submission.status_label}
                    <br />
                    <Show when={submission.has_send_to_guarantor}>Sudah Dikirim ke Asuransi</Show>
                  </p>
                  <Show when={submission.status === SubmissionStatus.REVISED}>
                    <p
                      className={`mt-2 py-1 uppercase text-xs font-semibold rounded text-center bg-red-100 text-red-800`}>
                      Di Revisi
                    </p>
                  </Show>
                  <Show when={submission.submission_before_id}>
                    <p
                      className={`w-[120px] mt-2 py-1 uppercase text-xs font-semibold rounded text-center bg-red-100 text-red-800`}>
                      Hasil Di Revisi
                    </p>
                  </Show>
                </TableCell>
                <TableCell>{submission.created_at}</TableCell>
                <TableCell className="text-right">
                  <Link href={route("monitoring.submission.detail", { id: submission.id })}>
                    <Button variant="outline" className="w-full" size="sm">
                      Detail
                    </Button>
                  </Link>
                  <Show
                    when={
                      submission.status !== SubmissionStatus.REJECTED &&
                      submission.status !== SubmissionStatus.REVISED &&
                      !submission.has_send_to_guarantor
                    }>
                    <Link href={route("monitoring.submission.edit", { id: submission.id })}>
                      <Button variant="outline" className="w-full mt-1" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </Show>
                </TableCell>
              </TableRow>
            )}
            renderFallback={() => (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          />
        </TableBody>
      </Table>
      <ShowingCountDatatable meta={submissions.meta} />
      <PaginationDatatable meta={submissions.meta} />
    </>
  );
};

export default SubmissionDatatable;
