import Show from "@/_features/_common/components/show";
import { formatCurrency } from "@/_features/_common/utils/format-currency";
import { Button } from "@/components/_shadcn-ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { SubmissionStatus } from "@/types/submission-status";
import { router } from "@inertiajs/react";
import React from "react";

interface SubmissionListDatatableProps {
  submissions: any;
}

const SubmissionListDatatable: React.FC<SubmissionListDatatableProps> = ({ submissions }) => {
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
              <TableRow key={submission.id} className={submission?.beyond_the_limit ? "bg-amber-300" : ""}>
                <TableCell>{submissions.meta.from + index}</TableCell>
                <TableCell>{submission?.staff?.office}</TableCell>
                <TableCell>{submission.principal?.name}</TableCell>
                <TableCell>{submission.guarantor_to_product_type?.full_name}</TableCell>
                <TableCell>{submission.no_guarantee}</TableCell>
                <TableCell>
                  {formatCurrency(submission.guarantee_value)} limit {formatCurrency(submission.employee_limit)}
                </TableCell>
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
                  </p>
                  <Show when={submission.is_revised}>
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
                <TableCell>
                  <Button
                    variant="default"
                    className="bg-white text-black shadow-sm hover:bg-white px-2 py-1.5 text-sm w-full rounded-sm text-start"
                    onClick={(e) => {
                      e.preventDefault();
                      router.visit(route("direksi-submission-detail.submission", submission.id));
                    }}>
                    Detail
                  </Button>
                </TableCell>
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
      <ShowingCountDatatable meta={submissions?.meta} />
      <PaginationDatatable meta={submissions?.meta} />
    </>
  );
};

export default SubmissionListDatatable;
