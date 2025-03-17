import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/_shadcn-ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import SubmissionDocumentDraftHeader from "./_partials/document-draft-page-header";
import { SubmissionDocumentDraftPageProps } from "./document-draft-page.type";

const SubmissionDocumentDraftPage: SubmissionDocumentDraftPageProps = ({ submissions }) => {
    const [search, setSearch] = useState("");
    const [select, setSelect] = useState(10);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const handleSelect = (value: string) => {
        setSelect(Number(value));
    };
    console.log(submissions);

    return (
        <main className="space-y-2.5">
            <div className="flex justify-between items-end">
                <div className="flex gap-x-3">
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
                            <TableHead>Perusahaan</TableHead>
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
                                    <TableCell>{submission.principal.name}</TableCell>
                                    <TableCell>
                                        {new Date(submission.created_at).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </TableCell>
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
                                        <Link href={route("staff-submission-docs.submission", { id: submission.id })}>
                                            <Button variant="outline" size="sm">
                                                Detail
                                            </Button>
                                        </Link>
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

export default SubmissionDocumentDraftPage;

SubmissionDocumentDraftPage.layout = (page: any) => {
    const pagePropsData = page.props;

    return (
        <RoleBasedLayout propsData={pagePropsData}>
            <SubmissionDocumentDraftHeader title={pagePropsData?.page_settings?.title} />
            {page}
        </RoleBasedLayout>
    );
};
