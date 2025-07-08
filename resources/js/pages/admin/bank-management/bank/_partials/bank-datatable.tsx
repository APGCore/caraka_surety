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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/_shadcn-ui/avatar";
import { Button, buttonVariants } from "@/components/_shadcn-ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/_shadcn-ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/_shadcn-ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { BankUtils } from "@/pages/admin/bank-management/bank/bank.utils";
import { Link, router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";

interface BankDatatableProps {
  banks: any;
}

const BankDatatable: React.FC<BankDatatableProps> = ({ banks }) => {
  const deleteBank = (bank: any) => {
    router.delete(route(BankUtils.link.destroy, bank.id));
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead>Penanggung Jawab(PIC)</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {banks?.data?.length > 0 ? (
            banks?.data?.map((bank: any, index: number) => (
              <TableRow key={bank.id}>
                <TableCell>{banks?.meta?.from + index}</TableCell>
                <TableCell>{bank.pic}</TableCell>
                <TableCell>{bank.name}</TableCell>
                <TableCell>{bank.email}</TableCell>
                <TableCell>{bank.created_at}</TableCell>
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
                              <DialogTitle>{bank?.name}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 grid gap-2">
                              <div className="flex items-center justify-center mb-4">
                                <Avatar className="w-[200px] h-[200px] shadow-2xl">
                                  <AvatarImage
                                    src={bank?.picture || "https://github.com/shadcn.png"}
                                    alt="@shadcn"
                                    className="object-contain w-full h-full"
                                  />
                                  <AvatarFallback>Foto</AvatarFallback>
                                </Avatar>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-normal">Penanggung Jawab(PIC)</span>
                                <span>{bank?.pic ?? ""}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-normal">Email</span>
                                <span>{bank?.email ?? "Email Belum Dimasukan"}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Provinsi</span>
                                <span>{bank?.province}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Kabupaten/Kota</span>
                                <span>{bank?.regency}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Kecamatan</span>
                                <span>{bank?.district}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Kelurahan/Desa</span>
                                <span>{bank?.village}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>Alamat</span>
                                <span>{bank?.address}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-normal">No. Telepon</span>
                                <span>{bank?.telephone}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="font-medium">Fax</span>
                                <span>{bank?.fax}</span>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          className="bg-blue-500 text-destructive-foreground shadow-sm hover:bg-blue-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                          href={route(BankUtils.link.branch, bank.id)}>
                          Daftar Cabang
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link
                          className="bg-amber-500 text-destructive-foreground shadow-sm hover:bg-ember-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                          href={route(BankUtils.link.edit, bank.id)}>
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
                              <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tindakan ini tidak dapat dibatalkan. Tindakan ini akan menghapus data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  deleteBank(bank);
                                }}
                                className={buttonVariants({ variant: "destructive" })}>
                                Delete
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
      <ShowingCountDatatable meta={banks?.meta} />
      <PaginationDatatable meta={banks?.meta} only={["guarantors"]} />
    </>
  );
};

export default BankDatatable;
