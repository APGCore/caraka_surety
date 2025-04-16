import { Button } from "@/components/_shadcn-ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { SubmissionStatus } from "@/types/submission-status";
import { Link } from "@inertiajs/react";
import React from "react";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

interface SubmissionHistoryDatatableProps {
  submissions: any;
}

const SubmissionHistoryDatatable: React.FC<SubmissionHistoryDatatableProps> = ({ submissions }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead>Perusahaan</TableHead>
            <TableHead>Tipe Produk</TableHead>
            <TableHead>Nilai Jaminan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Unit Bisnis</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={submissions.data}
            render={(submission: any, index: number) => (
              <TableRow key={submission.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{submission.principal?.name}</TableCell>
                <TableCell>{submission.guarantor_to_product_type?.full_name}</TableCell>
                <TableCell>{formatRupiah(submission.guarantee_value)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 uppercase text-xs font-semibold rounded ${
                      submission.status === SubmissionStatus.APPROVED
                        ? "bg-green-100 text-green-800"
                        : submission.status === SubmissionStatus.REJECTED
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {submission.status}
                  </span>
                </TableCell>
                <TableCell>{submission.staff.office}</TableCell>
                <TableCell>{submission.created_at}</TableCell>
                <TableCell className="text-right">
                  <Link href={route("direksi-submission-detail.submission", { id: submission.id })}>
                    <Button variant="outline" size="sm">
                      Detail
                    </Button>
                  </Link>
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
      <ShowingCountDatatable meta={submissions.meta} />
      <PaginationDatatable meta={submissions.meta} />
    </>
  );
};

export default SubmissionHistoryDatatable;
