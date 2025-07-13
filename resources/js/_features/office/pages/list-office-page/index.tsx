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
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Button, buttonVariants } from "@/_features/_common/components/_shadcn-ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/_features/_common/components/_shadcn-ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/_features/_common/components/_shadcn-ui/dropdown-menu";
import { Input } from "@/_features/_common/components/_shadcn-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_features/_common/components/_shadcn-ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/_features/_common/components/_shadcn-ui/table";
import { PrimaryButton } from "@/_features/_common/components/button/primary-button";
import { Pagination } from "@/_features/_common/components/datatable/pagination";
import RenderList from "@/_features/_common/components/render-list";
import TableSkeleton from "@/_features/_common/components/skeleton/table";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import { Link, router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Loader } from "lucide-react";
import { useState } from "react";
import useOffice from "../../hooks/use-office";
import { OFFICE_QUERY_KEY, OfficeData, OfficeType } from "../../services/office-query";

const ListOfficePage = ({ officeType }: { officeType: OfficeType }) => {
  const {
    offices,
    isLoadingOffice,
    isSuccessOffice,
    handleSearchChange,
    handlePerPageChange,
    handlePageChange,
    perPage,
    meta,
    search,
  } = useOffice({
    officeType,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = (id: number) => {
    setIsLoading(true);
    router.delete(route("branch.destroy", { profile: id }), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [OFFICE_QUERY_KEY.OFFICE_BY_TYPE],
            refetchType: "active",
          }),
        ]);
      },
      onFinish: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Cabang BPR</h1>
        <div className="flex gap-x-3">
          <PrimaryButton asChild>
            <Link
              href={route("branch.create", {
                type: "branch",
              })}>
              Tambah Cabang BPR
            </Link>
          </PrimaryButton>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <Select value={perPage} onValueChange={handlePerPageChange}>
            <SelectTrigger className="w-max">
              <SelectValue placeholder={perPage} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-x-3">
          <Input value={search || ""} onChange={handleSearchChange} placeholder="Cari Cabang BPR" />
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">#</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>User Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Jumlah Pengguna</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoadingOffice && <TableSkeleton colspan={6} />}
            {isSuccessOffice && offices && (
              <RenderList
                of={offices}
                render={(office: OfficeData, index) => {
                  return (
                    <TableRow key={office.id}>
                      <TableCell>{(meta?.from ?? 0) + index}</TableCell>
                      <TableCell>{office?.code}</TableCell>
                      <TableCell>{office?.name}</TableCell>
                      <TableCell>{office?.username}</TableCell>
                      <TableCell>{office?.email ?? "-"}</TableCell>
                      <TableCell>{office?.users?.length}</TableCell>
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
                                    <DialogTitle>{office?.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4 grid gap-2">
                                    <div className="flex items-center justify-between">
                                      <span className="font-normal">Email</span>
                                      <span>{office?.email ?? "Email Belum Dimasukan"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-normal">No. Telepon</span>
                                      <span>{office?.phone}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span>Alamat</span>
                                      <span>{office?.address}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">Provinsi</span>
                                      <span>{office?.province}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">Kabupaten/Kota</span>
                                      <span>{office?.regency}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">Kecamatan</span>
                                      <span>{office?.district}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">Kelurahan/Desa</span>
                                      <span>{office?.village}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">Kode Pos</span>
                                      <span>{office?.postal_code}</span>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer p-0" onSelect={(e) => e.preventDefault()}>
                              <Link
                                href={route("branch.employee.index", {
                                  office_id: office.id,
                                })}
                                className="bg-blue-500 text-destructive-foreground shadow-sm hover:bg-blue-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                                Pengguna
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer p-0" onSelect={(e) => e.preventDefault()}>
                              <Link
                                href={route("branch.edit", office.id)}
                                className="bg-amber-500 text-destructive-foreground shadow-sm hover:bg-amber-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="p-0 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                              <AlertDialog>
                                <AlertDialogTrigger className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                                  Delete
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tindakan ini akan menghapus data Cabang {office.name}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction asChild>
                                      <Button
                                        onClick={() => {
                                          handleDelete(office.id);
                                        }}
                                        className={buttonVariants({
                                          variant: "destructive",
                                        })}>
                                        {isLoading && <Loader />}
                                        Lanjutkan Hapus
                                      </Button>
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                }}
              />
            )}
          </TableBody>
        </Table>
        {isSuccessOffice && meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
      </div>
    </main>
  );
};

export default ListOfficePage;
