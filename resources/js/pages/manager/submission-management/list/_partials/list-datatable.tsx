import { formatCurrency } from "@/_features/_common/utils/format-currency";
import { Button } from "@/components/_shadcn-ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
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
              <TableRow key={submission.id} className={submission.beyond_the_limit ? "bg-amber-300" : ""}>
                <TableCell>{submissions.meta.from + index}</TableCell>
                <TableCell>{submission.staff?.office}</TableCell>
                <TableCell>{submission.principal?.name}</TableCell>
                <TableCell>{submission.guarantor_to_product_type?.full_name}</TableCell>
                <TableCell>{submission.no_guarantee}</TableCell>
                <TableCell>
                  {formatCurrency(submission.guarantee_value)} limit {formatCurrency(submission.employee_limit)}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 uppercase text-xs font-semibold rounded ${
                      submission.status === SubmissionStatus.APPROVED
                        ? "bg-green-100 text-green-800"
                        : submission.status === SubmissionStatus.REJECTED ||
                            submission.status === SubmissionStatus.BROKEN
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {submission.status}
                  </span>
                  <Show when={submission.submission_before_id}>
                    <span className={`px-2 py-1 uppercase text-xs font-semibold rounded bg-blue-100 text-blue-800`}>
                      Revisi
                    </span>
                  </Show>
                </TableCell>
                <TableCell>{submission.created_at}</TableCell>
                <TableCell>
                  <Button
                    variant="default"
                    className="bg-white text-black shadow-sm hover:bg-white px-2 py-1.5 text-sm w-full rounded-sm text-start"
                    onClick={(e) => {
                      e.preventDefault();
                      router.visit(route("manager-submission-detail.submission", submission.id));
                    }}>
                    Detail
                  </Button>
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

export default SubmissionListDatatable;
