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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminLayout from "@/layouts/admin";
import { getQueryParameter } from "@/lib/get-query-parameter";
import { GuarantorPageProps } from "@/pages/admin/guarantor-management/guarantor/guarantor-page.type";
import { Head, Link, router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { pickBy } from "lodash";
import { useState } from "react";

const AdminProductsPage: GuarantorPageProps = ({ guarantors }) => {
  const [select, setSelect] = useState(() =>
    getQueryParameter("per_page") ? Number(getQueryParameter("per_page")) : 10,
  );
  const [search, setSearch] = useState(() => getQueryParameter("search") ?? "");

  const handleSelect = (e: string) => {
    setSelect(Number(e));
    getData(String(select), search);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(String(select), search);
  };

  const getData = (per_page: string, search: string) => {
    return router.get(
      route("guarantor.index"),
      pickBy({
        per_page,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteProduct = (product: any) => {
    router.delete(route("guarantor.destroy", product.id));
  };

  return (
    <main className="space-y-2.5">
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
          <form onSubmit={(e) => handleSearch(e)} className="flex items-end gap-x-3">
            <Input
              className="h-full"
              placeholder="Cari Asuransi"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit">Cari</Button>
          </form>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">#</TableHead>
              <TableHead>Penanggung Jawab(PIC)</TableHead>
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
                            className="bg-amber-500 text-destructive-foreground shadow-sm hover:bg-ember-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                            href={route("guarantor.edit", guarantor.id)}>
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
                                  This action cannot be undone. This will permanently delete your product and remove
                                  your data from our servers.
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
      </div>
      <div className="text-sm text-gray-500">
        Showing {guarantors?.meta?.from} to {guarantors?.meta?.to} of {guarantors?.meta?.total} results
      </div>
      <Pagination>
        <PaginationContent>
          {guarantors?.meta?.links.map((link: any, index: number) => {
            return (
              <PaginationItem key={index + 1}>
                {link.url === null ? (
                  <Button variant="ghost" disabled>
                    {link.label}
                  </Button>
                ) : (
                  <PaginationLink
                    as="button"
                    preserveScroll
                    preserveState
                    only={["products"]}
                    isActive={link.active}
                    size={
                      link.label === "Previous" ||
                      link.label === "Next" ||
                      link.label === "Sebelumnya" ||
                      link.label === "Berikutnya"
                        ? "default"
                        : "icon"
                    }
                    href={link.url}>
                    {link.label}
                  </PaginationLink>
                )}
              </PaginationItem>
            );
          })}
        </PaginationContent>
      </Pagination>
    </main>
  );
};

export default AdminProductsPage;

AdminProductsPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title ?? "Products"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("guarantor.index")}>Kelola Asuransi</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{pagePropsData?.page_settings?.title}</h1>
        <Button asChild>
          <Link href={route("guarantor.create")}>Tambah Asuransi</Link>
        </Button>
      </div>
      {page}
    </AdminLayout>
  );
};
