import { PaginationDatatable } from "@/components/common/pagination-datatable";
import RenderList from "@/components/common/render-list";
import Show from "@/components/common/show";
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
import { textCurrency } from "@/lib/text-currency";
import FormGuarantorProductTypeRate from "@/pages/admin/guarantor-management/guarantor-product-type-limit/_partials/form-guarantor-product-type-rate";
import { GuarantorProductTypeRateUtils } from "@/pages/admin/guarantor-management/guarantor-product-type-limit/guarantor-product-type-rate.utils";
import { router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React, { useState } from "react";

interface GuarantorRateDatatableProps {
  guarantorProductTypes: any;
}

const GuarantorProductTypeRateDatatable: React.FC<GuarantorRateDatatableProps> = ({ guarantorProductTypes }) => {
  const [openForm, setOpenForm] = useState<boolean>(false);

  const onDelete = (guarantorProductType: any) => {
    if (guarantorProductType.limit.id) {
      router.delete(route(GuarantorProductTypeRateUtils.link.destroy, guarantorProductType.limit.id));
    }
  };
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kode</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Jenis Jaminan</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={guarantorProductTypes?.data}
            render={(guarantorProductType: any) => (
              <TableRow key={guarantorProductType.id}>
                <TableCell>{guarantorProductType.code}</TableCell>
                <TableCell>
                  {guarantorProductType.limit?.limit
                    ? "Rp. " + textCurrency(guarantorProductType.limit?.limit)
                    : "Belum di setting"}
                </TableCell>
                <TableCell>{guarantorProductType.full_name}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                        <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36 mr-8 mt-1">
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <AlertDialog open={openForm} onOpenChange={setOpenForm}>
                          <AlertDialogTrigger className="bg-primary text-destructive-foreground shadow-sm hover:bg-primary/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                            Setting Limit
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Setting Limit {guarantorProductType?.full_name}</AlertDialogTitle>
                              <AlertDialogDescription>Tindakan ini akan setting limit pengajuan</AlertDialogDescription>
                            </AlertDialogHeader>
                            <FormGuarantorProductTypeRate
                              guarantorProductType={guarantorProductType}
                              closeForm={() => setOpenForm(false)}
                            />
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem>
                      <Show when={guarantorProductType?.limit}>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="p-0" onSelect={(e) => e.preventDefault()}>
                          <AlertDialog>
                            <AlertDialogTrigger className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                              Delete
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                <AlertDialogDescription>Aksi ini akan menghapus data limit ini.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Kembali</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    onDelete(guarantorProductType);
                                  }}
                                  className={buttonVariants({ variant: "destructive" })}>
                                  Lanjutkan Hapus Limit
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuItem>
                      </Show>
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
      <ShowingCountDatatable meta={guarantorProductTypes?.meta} />
      <PaginationDatatable meta={guarantorProductTypes?.meta} only={["profiles"]} />
    </>
  );
};

export default GuarantorProductTypeRateDatatable;
