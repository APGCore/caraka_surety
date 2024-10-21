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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";
import FormSkoring from "./form-scoring";

interface ScoringDatatableProps {
  scorings: any;
  onDelete: (scoring: any) => void;
}

const ScoringDatatable: React.FC<ScoringDatatableProps> = ({ scorings, onDelete }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Poin Minimal</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={scorings?.data}
            render={(scoring: any, index: number) => (
              <TableRow key={scoring.id}>
                <TableCell>{scorings?.meta?.from + index}</TableCell>
                <TableCell>{scoring.name}</TableCell>
                <TableCell>{scoring.min_point}</TableCell>
                <TableCell>{scoring.created_at}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                        <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36 mr-8 mt-1">
                      <FormSkoring isEdit scoring={scoring} />
                      <DropdownMenuSeparator />
                      <ConfirmDialog
                        title="Apakah Anda yakin?"
                        desription="Aksi ini akan menghapus data scoring ini."
                        cancelLabel="Kembali"
                        actionLabel="Lanjutkan Hapus Skoring"
                        triggerLabel="Delete"
                        type="delete"
                        value={scoring}
                        onAction={() => onDelete(scoring)}
                      />
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
      <ShowingCountDatatable meta={scorings?.meta} />
      <PaginationDatatable meta={scorings?.meta} only={["scorings"]} />
    </>
  );
};

export default ScoringDatatable;
