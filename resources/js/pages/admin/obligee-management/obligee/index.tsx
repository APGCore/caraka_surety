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
import { ObligeeManagementPageProps } from "@/pages/admin/obligee-management/obligee/obligee-management-page.type";
import { Head, Link, router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { pickBy } from "lodash";
import { useState } from "react";

const ObligeeManagementPage: ObligeeManagementPageProps = (props) => {
  const { data: obligees, meta } = props.obligees;

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
      route("obligee.index"),
      pickBy({
        per_page: perPage,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteData = (obligee: any) => {
    router.delete(route("obligee.destroy", obligee.id));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Obligee</h1>
        <div className="flex gap-x-3">
          <Link
            className={cn(
              buttonVariants({
                variant: "default",
              }),
            )}
            href={route("obligee.create")}>
            Tambah Obligee
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
        </div>
        <div className="flex gap-x-3">
          <form onSubmit={(e) => handleSearchNew(e)} className="flex items-end gap-x-3">
            <Input placeholder="Cari Obligee" value={search} onChange={(e) => setSearch(e.target.value)} />
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
              <TableHead>PIC</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {obligees.length > 0 ? (
              obligees.map((obligee: any, index: number) => (
                <TableRow key={obligee.id}>
                  <TableCell>{meta.from + index}</TableCell>
                  <TableCell>{obligee?.name}</TableCell>
                  <TableCell>{obligee?.pic}</TableCell>
                  <TableCell>{obligee?.created_at}</TableCell>
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
                          <Link href={route("obligee.show", { id: obligee.id })}>Detail</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer p-0" onSelect={(e) => e.preventDefault()}>
                          <Link
                            href={route("obligee.edit", obligee.id)}
                            className="text-destructive-foreground shadow-sm hover:bg-amber-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
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
                                  Tindakan ini akan menghapus data obligee {obligee.name}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    deleteData(obligee);
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

export default ObligeeManagementPage;

ObligeeManagementPage.layout = (page: any) => {
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
