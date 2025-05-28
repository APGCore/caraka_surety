import RenderList from "@/_features/_common/components/render-list";
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Button, buttonVariants } from "@/components/_shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/_shadcn-ui/dropdown-menu";
import { Input } from "@/components/_shadcn-ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/_shadcn-ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Head, Link, router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { pickBy } from "lodash";
import React, { useState } from "react";
import { DocumentGeneralPageProps } from "./documents-general-required.page.type";

const DocumentGeneralPage: DocumentGeneralPageProps = ({ reqDocs }) => {
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(10);
  const [requiredDocs, setRequiredDocs] = useState(() => reqDocs);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(String(select), search);
  };

  const handleSelect = (value: string) => {
    setSelect(Number(value));
    getData(value, search);
  };

  const handleExport = () => {};

  const getData = (perPage: string, search: string) => {
    return router.get(
      route("document.index"),
      pickBy({
        per_page: perPage,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const changeOrder = (e: any, id: any) => {
    setRequiredDocs((prevState) => {
      const newState = [...prevState];
      const index = newState.findIndex((item) => item.id === id);
      const value = Number(e.target.value);
      const existingValue = newState.filter((item) => item.no === value && item.id !== id);
      if (index !== -1 && value > 0 && existingValue.length === 0) {
        newState[index].no = value;
      }
      return newState;
    });
  };

  const handleSaveOrder = (e: any, id: any) => {
    e.preventDefault();
    axios.put(route("document.update.no", id), { no: Number(e.target.value) }).then();
  };

  const deleteData = (reqDoc: any) => {
    router.delete(route("document.destroy", reqDoc.id));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <Button onClick={handleExport}>Export</Button>
          <Select onValueChange={handleSelect} defaultValue={String(select)}>
            <SelectTrigger className="w-max">
              <SelectValue placeholder="Items per page" />
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
          <form onSubmit={handleSearch} className="flex items-end gap-x-3">
            <Input
              className="h-full"
              placeholder="Cari Prasyarat Dokumen"
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
              <TableHead>No Urut</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Produk</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <RenderList
              of={requiredDocs}
              render={(reqDoc: any, index: number) => (
                <TableRow key={reqDoc.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      className="w-[40pt]"
                      value={reqDoc.no}
                      min={1}
                      onChange={(e) => changeOrder(e, reqDoc.id)}
                      onBlur={(e) => handleSaveOrder(e, reqDoc.id)}
                      placeholder="No Urut"
                    />
                  </TableCell>
                  <TableCell>{reqDoc.name}</TableCell>
                  <TableCell
                    className={
                      reqDoc.product_type_id
                        ? "px-2 py-1 text-xs font-semibold rounded text-yellow-600"
                        : "px-2 py-1 text-xs font-semibold rounded text-green-600"
                    }>
                    {reqDoc.product_type_id ? "Khusus" : "Umum"}
                  </TableCell>

                  <TableCell>{reqDoc.product_type ? reqDoc.product_type.name : "Tidak Memilih"}</TableCell>
                  <TableCell>{reqDoc.description}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-8 w-8 p-0 group">
                          <DotsHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-36 mr-8 mt-1">
                        {/* <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={route("submission.show", { id: reqDoc.id })}>Detail</Link>
                        </DropdownMenuItem> */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={route("document.edit", { requiredDoc: reqDoc.id })}>Edit</Link>
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
                                <AlertDialogDescription>
                                  Tindakan ini tidak dapat diurungkan. Ini akan menghapus pengajuan secara permanen.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteData(reqDoc)}
                                  className={buttonVariants({
                                    variant: "destructive",
                                  })}>
                                  Hapus
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
                  <TableCell colSpan={6} className="text-center">
                    Tidak ada data ditemukan
                  </TableCell>
                </TableRow>
              )}
            />
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-gray-500">
        Menampilkan {reqDocs.length > 0 ? 1 : 0} sampai {reqDocs.length} dari {reqDocs.length} hasil
      </div>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button variant="ghost" disabled>
              Previous
            </Button>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink as="button" size="icon" href="#">
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <Button variant="ghost" disabled>
              Next
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
};

export default DocumentGeneralPage;

DocumentGeneralPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <Head title={pagePropsData?.page_settings?.title ?? "Pengajuan"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            {/* <BreadcrumbLink href={route("pengajuan.index")}>Kelola Pengajuan</BreadcrumbLink> */}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{pagePropsData?.page_settings?.title}</h1>
        <Button asChild>
          <Link href={route("document.create")}>Tambah Required Document</Link>
        </Button>
      </div>
      {page}
    </RoleBasedLayout>
  );
};
