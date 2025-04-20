import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/_features/_common/components/_shadcn-ui/popover";
import { Button } from "@/components/_shadcn-ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { SubmissionStatus } from "@/types/submission-status";
import { Link } from "@inertiajs/react";
import { EllipsisVertical } from "lucide-react";
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

const SubmissionHistoryDatatable: React.FC<SubmissionHistoryDatatableProps> = ({ submissions }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead>Perusahaan</TableHead>
            <TableHead>Tipe Produk</TableHead>
            <TableHead>Nomor Jaminan</TableHead>
            <TableHead>Nilai Jaminan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-center">Actions</TableHead>
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
                <TableCell>{submission.no_guarantee}</TableCell>
                <TableCell>{formatRupiah(submission.guarantee_value)}</TableCell>
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
                </TableCell>
                <TableCell>{submission?.created_at}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1">
                    <Show when={submission.status === SubmissionStatus.APPROVED && submission.is_revised}>
                      <Button variant="secondary" size="sm">
                        Di Revisi
                      </Button>
                    </Show>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon">
                          <EllipsisVertical />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[8vw]">
                        <div className="space-y-1">
                          <Button variant="outline" className="w-full" asChild>
                            <Link href={route("staff-submission-detail.submission", { id: submission.id })}>
                              Detail
                            </Link>
                          </Button>
                          <Show when={submission.status === SubmissionStatus.PROCESS}>
                            <Button variant="outline" className="w-full" asChild>
                              <Link href={route("staff-submission-edit", { id: submission.id })}>Edit</Link>
                            </Button>
                          </Show>
                          <Show
                            when={
                              submission.status === SubmissionStatus.APPROVED &&
                              !submission.is_revised &&
                              !submission.submission_before_id
                            }>
                            <Button asChild>
                              <Link
                                type="button"
                                href={route("staff-submission-revision", {
                                  id: submission.id,
                                })}
                                className="w-full">
                                Revisi
                              </Link>
                            </Button>
                          </Show>
                          <Show
                            when={
                              submission.status === SubmissionStatus.APPROVED ||
                              submission.status === SubmissionStatus.PROCESS
                            }>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" className="w-full">
                                  Rusak
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="sm:max-w-[425px]">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Pengajuan Rusak</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin bahwa pengajuan ini rusak?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="grid grid-cols-2 gap-4">
                                  <AlertDialogCancel asChild>
                                    <Button variant="outline" className="w-full" type="button">
                                      Batalkan
                                    </Button>
                                  </AlertDialogCancel>
                                  <Button variant="destructive" className="w-full" type="submit" asChild>
                                    <Link
                                      href={route("staff-submission-broken", {
                                        id: submission.id,
                                      })}>
                                      Rusak
                                    </Link>
                                  </Button>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </Show>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
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
      <ShowingCountDatatable meta={submissions.meta} />
      <PaginationDatatable meta={submissions.meta} only={["submissions"]} />
    </>
  );
};

export default SubmissionHistoryDatatable;
