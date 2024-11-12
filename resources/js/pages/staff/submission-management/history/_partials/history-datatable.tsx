import ConfirmDialog from "@/components/common/confirm-dialog";
import { PaginationDatatable } from "@/components/common/pagination-datatable";
import RenderList from "@/components/common/render-list";
import { ShowingCountDatatable } from "@/components/common/showing-count-datatable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";

// import FormSkoring from "./form-submission";

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

interface SubmissionHistoryDatatableProps {
  submissions: any;
  onDelete: (submission: any) => void;
}

const SubmissionHistoryDatatable: React.FC<SubmissionHistoryDatatableProps> = ({ submissions, onDelete }) => {
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
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={submissions}
            render={(submission: any, index: number) => (
              <TableRow key={submission.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{submission?.principal?.name}</TableCell>
                <TableCell>{submission?.guarantor_to_product_type?.full_name}</TableCell>
                <TableCell>{formatRupiah(submission?.contract_value)}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 uppercase text-xs font-semibold rounded ${
                      submission.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : submission.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {submission.status}
                  </span>
                </TableCell>
                <TableCell>{submission?.created_at}</TableCell>
                <TableCell className="text-right">
                  <Link href={route("staff-submission-detail.submission", { id: submission.id })}>
                    <Button variant="outline" size="sm">
                      Detail
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            )}
            renderFallback={() => (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
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

export default SubmissionHistoryDatatable;
