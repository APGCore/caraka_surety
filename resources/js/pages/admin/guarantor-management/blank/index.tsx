import { Combobox } from "@/components/common/combobox";
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminLayout from "@/layouts/admin";
import { cn } from "@/lib/cn";
import { getQueryParameter } from "@/lib/get-query-parameter";
import { BlankPageProps } from "@/pages/admin/guarantor-management/blank/employee-page.type";
import { Head, Link, router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { pickBy } from "lodash";
import { useState } from "react";

const BlankPage: BlankPageProps = ({ guarantors, guarantorSelected, ...props }) => {
  const { data: blanks, meta } = props.blanks;

  const [select, setSelect] = useState(() =>
    getQueryParameter("per_page") ? Number(getQueryParameter("per_page")) : 10,
  );
  const [search, setSearch] = useState(() => getQueryParameter("search") ?? "");
  const handleSelect = (e: string) => {
    setSelect(Number(e));
    getData(e, search, guarantorSelected);
  };

  const handleSearchNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(String(select), search, guarantorSelected);
  };

  const getData = (perPage: string, search: string, officeSelected: number) => {
    return router.get(
      route("employee.index"),
      pickBy({
        per_page: perPage,
        search,
        office_id: officeSelected,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const setOffice = (office: any) => {
    return router.get(
      route("employee.index"),
      pickBy({
        office_id: office.id,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteData = (employee: any) => {
    router.delete(route("employee.destroy", employee.id));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Karyawan</h1>
        <div className="flex gap-x-3">
          <Link
            className={cn(
              buttonVariants({
                variant: "default",
              }),
            )}
            href={route("employee.create") + "?office_id=" + guarantorSelected}>
            Tambah Karyawan
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <Button>Export</Button>
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
          <Combobox
            datas={guarantors}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={guarantorSelected}
            placeholder={"Pilih Kantor"}
            className={"w-[210px]"}
            onSelect={(value) => setOffice(value)}
          />
        </div>
        <div className="flex gap-x-3">
          <form onSubmit={(e) => handleSearchNew(e)} className="flex items-end gap-x-3">
            <Input placeholder="Cari Karyawan" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type="submit">Cari</Button>
          </form>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">#</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {blanks.length > 0 ? (
              blanks.map((blank: any, index: number) => (
                <TableRow key={blank.id}>
                  <TableCell>{meta.from + index}</TableCell>
                  <TableCell>{blank.name}</TableCell>
                  <TableCell>{blank.email}</TableCell>
                  <TableCell>{blank.position}</TableCell>
                  <TableCell>{blank.created_at}</TableCell>
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
                                <DialogTitle>{blank?.name}</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4 grid gap-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-normal">Email</span>
                                  <span>{blank?.email ?? "Email Belum Dimasukan"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="font-normal">No. Telepon</span>
                                  <span>{blank?.phone}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="font-normal">Jabatan</span>
                                  <span>{blank?.position}</span>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer p-0" onSelect={(e) => e.preventDefault()}>
                          <Link
                            href={route("employee.edit", blank.id) + "?office_id=" + guarantorSelected}
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
                                  Tindakan ini akan menghapus data blangko?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    deleteData(blank);
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
      </div>
      <ShowingCountDatatable meta={meta} />
      <PaginationDatatable meta={meta} />
    </main>
  );
};

export default BlankPage;

BlankPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{pagePropsData?.page_settings?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </AdminLayout>
  );
};
