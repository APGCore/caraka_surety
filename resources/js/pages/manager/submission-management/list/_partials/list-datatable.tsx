import { PaginationDatatable } from "@/components/common/pagination-datatable";
import RenderList from "@/components/common/render-list";
import { ShowingCountDatatable } from "@/components/common/showing-count-datatable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
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
import { SubmissionStatus } from "@/types/submission-status";
import { router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleApprove = (submissionId: number) => {
    setIsLoading(true);
    axios
      .post(route("manager-submission-approve", submissionId))
      .then((response) => {
        console.log("success approve submission", response);
        router.reload();
      })
      .catch((error) => {
        console.log("error approve submission", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleReject = (submissionId: number) => {
    setIsLoading(true);
    axios
      .post(route("manager-submission-reject", submissionId))
      .then((response) => {
        console.log("success reject submission", response);
        router.reload();
      })
      .catch((error) => {
        console.log("error reject submission", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
              <TableRow key={submission.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{submission?.principal?.name}</TableCell>
                <TableCell>{submission?.guarantor_to_product_type?.full_name}</TableCell>
                <TableCell>{formatRupiah(submission?.contract_value)}</TableCell>
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                        <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36 mr-8 mt-1">
                      {submission.status === SubmissionStatus.PROCESS && (
                        <>
                          <DropdownMenuItem className="p-0 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="default"
                                  disabled={isLoading}
                                  className="bg-green-600 text-destructive-foreground shadow-sm hover:bg-green-400 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                                  {isLoading && <LoaderCircle className="animate-spin mr-1" />}
                                  Approve
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Apakah Anda Yakin ingin menyetujui pengajuan ini?</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-green-600 hover:bg-green-400"
                                    onClick={() => handleApprove(submission.id)}>
                                    Setujui
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {submission.status === SubmissionStatus.PROCESS && (
                        <DropdownMenuItem className="p-0 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="default"
                                disabled={isLoading}
                                className="bg-red-600 text-destructive-foreground shadow-sm hover:bg-red-400 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                                {isLoading && <LoaderCircle className="animate-spin mr-1" />}
                                Reject
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda Yakin ingin menolak pengajuan ini?</AlertDialogTitle>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-red-600 hover:bg-red-400"
                                  onClick={() => handleReject(submission.id)}>
                                  Tolak
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
