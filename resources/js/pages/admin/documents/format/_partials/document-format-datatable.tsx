import { formatToDateIndonesian } from "@/common/utils/date-indo";
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
} from "@/components/_shadcn-ui/alert-dialog";
import { Button, buttonVariants } from "@/components/_shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/_shadcn-ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { DocumentFormatUtils } from "@/pages/admin/documents/format/document-format.utils";
import { Link, router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";

interface DocumentFormatDatatableProps {
  documentFormats: any;
  guarantorSelectedId: number;
  productSelectedId: number;
  guarantorProductTypeId: number;
}

const DocumentFormatDatatable: React.FC<DocumentFormatDatatableProps> = ({ ...props }) => {
  const { data: documentFormats, meta } = props.documentFormats;
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

  const onDelete = (documentFormat: any) => {
    setIsLoadingDelete(true);
    router.delete(route(DocumentFormatUtils.link.destroy, documentFormat.id), {
      onFinish: () => {
        setIsLoadingDelete(false);
      },
    });
  };
  console.log(meta);
  return (
    <>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">#</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <RenderList
              of={documentFormats}
              render={(documentFormat: any, index: number) => (
                <TableRow key={documentFormat.id}>
                  <TableCell>{meta?.from + index}</TableCell>
                  <TableCell>{documentFormat?.name}</TableCell>
                  <TableCell>{documentFormat?.type}</TableCell>
                  <TableCell>{formatToDateIndonesian(documentFormat?.created_at)}</TableCell>
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
                          <Link
                            className="bg-amber-500 text-destructive-foreground shadow-sm hover:bg-ember-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                            href={route(DocumentFormatUtils.link.edit, documentFormat.id)}>
                            Edit
                          </Link>
                        </DropdownMenuItem>
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
                                    onDelete(documentFormat);
                                  }}
                                  className={buttonVariants({
                                    variant: "destructive",
                                  })}>
                                  {isLoadingDelete && <LoaderCircle className="animate-spin mr-1 flex-shrink-0" />}
                                  Lanjutkan Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuItem>
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
      </div>
      <ShowingCountDatatable meta={meta} />
      <PaginationDatatable meta={meta} />
    </>
  );
};

export default DocumentFormatDatatable;
