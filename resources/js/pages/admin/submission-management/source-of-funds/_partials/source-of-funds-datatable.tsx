import { Button } from "@/components/_shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/_shadcn-ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import ConfirmDialog from "@/components/common/confirm-dialog";
import { PaginationDatatable } from "@/components/common/pagination-datatable";
import RenderList from "@/components/common/render-list";
import { ShowingCountDatatable } from "@/components/common/showing-count-datatable";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";
import FormSourceOfFunds from "./form-source-of-funds";

interface SourceOfFundsDatatableProps {
  sourceOfFunds: any;
  onDelete: (scoring: any) => void;
}

const SourceOfFundsDatatable: React.FC<SourceOfFundsDatatableProps> = ({ sourceOfFunds, onDelete }) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={sourceOfFunds?.data}
            render={(sourceOfFund: any, index: number) => (
              <TableRow key={sourceOfFund.id}>
                <TableCell>{sourceOfFunds?.meta?.from + index}</TableCell>
                <TableCell>{sourceOfFund.name}</TableCell>
                <TableCell>{sourceOfFund.created_at}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                        <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36 mr-8 mt-1">
                      <FormSourceOfFunds isEdit sourceOfFunds={sourceOfFund} />
                      <DropdownMenuSeparator />
                      <ConfirmDialog
                        title="Apakah Anda yakin?"
                        desription="Aksi ini akan menghapus data sumber dana ini."
                        cancelLabel="Kembali"
                        actionLabel="Lanjutkan Sumber Dana"
                        triggerLabel="Delete"
                        type="delete"
                        value={sourceOfFund}
                        onAction={() => onDelete(sourceOfFund)}
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
      <ShowingCountDatatable meta={sourceOfFunds?.meta} />
      <PaginationDatatable meta={sourceOfFunds?.meta} only={["sourceOfFounds"]} />
    </>
  );
};

export default SourceOfFundsDatatable;
