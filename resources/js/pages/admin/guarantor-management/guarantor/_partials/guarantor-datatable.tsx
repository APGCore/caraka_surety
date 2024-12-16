import { PaginationDatatable } from "@/components/common/pagination-datatable";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GuarantorUtils } from "@/pages/admin/guarantor-management/guarantor/guarantor.utils";
import { Link, router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";

interface GuarantorDatatableProps {
  guarantors: any;
}

const GuarantorDatatable: React.FC<GuarantorDatatableProps> = ({ guarantors }) => {
  const deleteProduct = (product: any) => {
    router.delete(route(GuarantorUtils.link.destroy, product.id));
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead>Penanggung Jawab(PIC)</TableHead>
            <TableHead>Kode</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {guarantors?.data?.length > 0 ? (
            guarantors?.data?.map((guarantor: any, index: number) => (
              <TableRow key={guarantor.id}>
                <TableCell>{guarantors?.meta?.from + index}</TableCell>
                <TableCell>{guarantor.pic}</TableCell>
                <TableCell>{guarantor.code}</TableCell>
                <TableCell>{guarantor.name}</TableCell>
                <TableCell>{guarantor.created_at}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                        <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36 mr-8 mt-1">
                      <DropdownMenuItem className="p-0 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                        <Dialog>
                          <DialogTrigger className="bg-black text-destructive-foreground shadow-sm hover:bg-black/60 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                            Show
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>{guarantor?.name}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 grid gap-2">
                              <div className="flex items-center justify-center mb-4">
                                <Avatar className="w-[200px] h-[200px] shadow-2xl">
                                  <AvatarImage
                                    src={guarantor?.picture || "https://github.com/shadcn.png"}
                                    alt="@shadcn"
                                    className="object-contain w-full h-full"
                                  />
                                  <AvatarFallback>Foto</AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-normal">Penanggung Jawab(PIC)</span>
                                <span>{guarantor?.pic ?? ""}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-normal">Email</span>
                                <span>{guarantor?.email ?? "Email Belum Dimasukan"}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Provinsi</span>
                                <span>{guarantor?.province}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Kabupaten/Kota</span>
                                <span>{guarantor?.regency}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Kecamatan</span>
                                <span>{guarantor?.district}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Kelurahan/Desa</span>
                                <span>{guarantor?.village}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Alamat</span>
                                <span>{guarantor?.address}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-normal">No. Telepon</span>
                                <span>{guarantor?.telephone}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Fax</span>
                                <span>{guarantor?.fax}</span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          className="bg-blue-500 text-destructive-foreground shadow-sm hover:bg-blue-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                          href={route(GuarantorUtils.link.branch, guarantor.id)}>
                          Daftar Cabang
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          className="bg-amber-500 text-destructive-foreground shadow-sm hover:bg-ember-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                          href={route(GuarantorUtils.link.edit, guarantor.id)}>
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
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your product and remove your
                                data from our servers.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  deleteProduct(guarantor);
                                }}
                                className={buttonVariants({ variant: "destructive" })}>
                                Continue Delete Asuransi
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No data found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ShowingCountDatatable meta={guarantors?.meta} />
      <PaginationDatatable meta={guarantors?.meta} only={["guarantors"]} />
    </>
  );
};

export default GuarantorDatatable;
