import { Button } from "@/components/_shadcn-ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/_shadcn-ui/dropdown-menu";
import { Input } from "@/components/_shadcn-ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/_shadcn-ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Link } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import SubmissionHistoryHeader from "./_partials/history-page-header";
import { SubmissionHistoryPageProps } from "./history-page.type";

const SubmissionHistoryPage: SubmissionHistoryPageProps = ({ submissions }) => {
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
          <TableBody>
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

                        <DropdownMenuSeparator />
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
          </TableBody>
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

export default SubmissionHistoryPage;

SubmissionHistoryPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <SubmissionHistoryHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
