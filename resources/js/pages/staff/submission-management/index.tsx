import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Button } from "@/components/_shadcn-ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/_shadcn-ui/dropdown-menu";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/_shadcn-ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Head, Link } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { pickBy } from "lodash";
import { useState } from "react";
import { SubmissionPageProps } from "./submission-page.type";

const SubmissionPage: SubmissionPageProps = ({ submissions }) => {
    const [search, setSearch] = useState("");
    const [select, setSelect] = useState("10");

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const handleSelect = (value: string) => {
        setSelect(value);
    };

    return (
        <main className="space-y-2.5">
            <div className="flex justify-between items-end">
                <SelectLengthDatatable defaultValue={select} onChange={handleSelect} />
                <SearchDatatable
                    value={search}
                    onChange={setSearch}
                    onSubmit={handleSearch}
                    placeholder="Cari Pengajuan"
                />
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
                                                    <Link href={route("submission.show", { id: submission.id })}>
                                                        Detail
                                                    </Link>
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

export default SubmissionPage;

SubmissionPage.layout = (page: any) => {
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
                <Button asChild>{/* <Link href={route("pengajuan.create")}>Tambah Pengajuan</Link> */}</Button>
            </div>
            {page}
        </RoleBasedLayout>
    );
};
