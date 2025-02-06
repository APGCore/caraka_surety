import { cn } from "@/common/utils/cn";
import { getQueryParameter } from "@/common/utils/get-query-parameter";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/_shadcn-ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/_shadcn-ui/dropdown-menu";
import { Input } from "@/components/_shadcn-ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import TableSkeleton from "@/components/atoms/skeleton/table";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import HeaderPage from "@/components/molecules/header";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Link, router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { pickBy } from "lodash";
import { useState } from "react";
import { MarketingPartnerOfficePageProps } from "./marketing-partner-office-page.type";

const MarketingPartnerOfficePage: MarketingPartnerOfficePageProps = (props) => {
  const { data: profiles, meta } = props.profiles;

  const [select, setSelect] = useState(() =>
    getQueryParameter("per_page") ? Number(getQueryParameter("per_page")) : 10,
  );
  const [search, setSearch] = useState(() => getQueryParameter("search") ?? "");
  const handleSelect = (e: string) => {
    setSelect(Number(e));
    getData(e, search);
  };

  const handleSearchNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(String(select), search);
  };

  const getData = (perPage: string, search: string) => {
    return router.get(
      route("branch.index"),
      pickBy({
        per_page: perPage,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteData = (province: any) => {
    router.delete(route("branch.destroy", province.id));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{props?.page_settings?.title}</h1>
        <div className="flex gap-x-3">
          <Link
            className={cn(
              buttonVariants({
                variant: "default",
              }),
            )}
            href={route("branch-mitra-pemasaran.create", {
              type: "marketing-partner",
            })}>
            Tambah Mitra Pemasaran
          </Link>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          {/* <Button>Export</Button> */}
          <Select onValueChange={(e) => handleSelect(e)} defaultValue={String(select)}>
            <SelectTrigger className="w-max">
              <SelectValue placeholder="Theme" />
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
          <form onSubmit={(e) => handleSearchNew(e)} className="flex items-end gap-x-3">
            <Input placeholder="Cari Mitra Pemasaran" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type="submit">Cari</Button>
          </form>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">#</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Jumlah Pengguna</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <Show when={profiles.length > 0} fallback={<TableSkeleton colspan={5} />}>
              <RenderList
                of={profiles}
                render={(profile: any, index) => {
                  return (
                    <TableRow key={profile.id}>
                      <TableCell>{meta.from + index}</TableCell>
                      <TableCell>{profile?.code}</TableCell>
                      <TableCell>{profile?.name}</TableCell>
                      <TableCell>{profile?.email ?? "-"}</TableCell>
                      <TableCell>{profile?.users_count === 0 ? "-" : Number(profile?.users_count)}</TableCell>
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
                                    <DialogTitle>{profile?.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4 grid gap-2">
                                    <div className="flex items-center justify-between">
                                      <span className="font-normal">Email</span>
                                      <span>{profile?.email ?? "Email Belum Dimasukan"}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-normal">No. Telepon</span>
                                      <span>{profile?.phone}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span>Alamat</span>
                                      <span>{profile?.address}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">Provinsi</span>
                                      <span>{profile?.province}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">Kabupaten/Kota</span>
                                      <span>{profile?.regency}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">Kecamatan</span>
                                      <span>{profile?.district}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">Kelurahan/Desa</span>
                                      <span>{profile?.village}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium">Kode Pos</span>
                                      <span>{profile?.postal_code}</span>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer p-0" onSelect={(e) => e.preventDefault()}>
                              <Link
                                href={route("branch.edit", profile.id)}
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
                                      Tindakan ini akan menghapus data Cabang {profile.name}?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Batal</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => {
                                        deleteData(profile);
                                      }}
                                      className={buttonVariants({ variant: "destructive" })}>
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
                  );
                }}
              />
            </Show>
          </TableBody>
        </Table>
      </div>
      <ShowingCountDatatable meta={meta} />
      <PaginationDatatable meta={meta} />
    </main>
  );
};

export default MarketingPartnerOfficePage;

MarketingPartnerOfficePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <HeaderPage {...pagePropsData} />
      {page}
    </RoleBasedLayout>
  );
};
