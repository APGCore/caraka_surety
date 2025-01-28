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
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Head, Link, usePage } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { SubmissionPageProps } from "./submission-page.type";

const SubmissionPage: SubmissionPageProps = ({ submissions }) => {
  const [search, setSearch] = useState("");
  const [select, setSelect] = useState(10);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleSelect = (value: string) => {
    setSelect(Number(value));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <Button>Export</Button>
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
              placeholder="Cari Pengajuan"
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
              <TableHead>Nama Pemohon</TableHead>
              <TableHead>Tanggal Pengajuan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          {/* <TableBody>
            {submissions.length > 0 ? (
              submissions.map((submission, index) => (
                <TableRow key={submission.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{submission.name}</TableCell>
                  <TableCell>{submission.created_at}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        submission.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : submission.status === "Rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {submission.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-8 w-8 p-0 group">
                          <DotsHorizontalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-36 mr-8 mt-1">
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={route("submission.show", { id: submission.id })}>Detail</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link href={`/pengajuan/edit/${submission.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="p-0">
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
                                  onClick={() => {
                                    // Tambahkan logika penghapusan di sini
                                  }}
                                  className={buttonVariants({ variant: "destructive" })}>
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Tidak ada data ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody> */}
        </Table>
      </div>
      <div className="text-sm text-gray-500">
        Menampilkan {submissions.length > 0 ? 1 : 0} sampai {submissions.length} dari {submissions.length} hasil
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

export default SubmissionPage;

SubmissionPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
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
        <Button asChild>{/* <Link href={route("pengajuan.create")}>Tambah Pengajuan</Link> */}</Button>
      </div>
      {page}
    </AdminLayout>
  );
};
