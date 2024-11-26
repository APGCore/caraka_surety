import { PaginationDatatable } from "@/components/common/pagination-datatable";
import RenderList from "@/components/common/render-list";
import { ShowingCountDatatable } from "@/components/common/showing-count-datatable";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SubmissionStatus } from "@/types/submission-status";
import { router } from "@inertiajs/react";
import React from "react";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

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
            <TableHead>Perusahaan</TableHead>
            <TableHead>Tipe Produk</TableHead>
            <TableHead>Nilai Kontrak</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={submissions}
            render={(submission: any, index: number) => (
              <TableRow
                key={submission.id}
                className={submission.manager_limit < submission.contract_value ? "bg-amber-300" : ""}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{submission?.principal?.name}</TableCell>
                <TableCell>{submission?.guarantor_to_product_type?.full_name}</TableCell>
                <TableCell>
                  {formatRupiah(submission?.contract_value)} limit {formatRupiah(submission?.manager_limit)}
                </TableCell>
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
                <TableCell>{submission?.created_at}</TableCell>
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
                <TableCell colSpan={5} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          />
        </TableBody>
      </Table>
      <ShowingCountDatatable meta={submissions?.meta} />
      <PaginationDatatable meta={submissions?.meta} only={["submissions"]} />
    </>
  );
};

export default SubmissionListDatatable;
