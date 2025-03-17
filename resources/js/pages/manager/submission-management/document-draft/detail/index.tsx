import { Button } from "@/components/_shadcn-ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/_shadcn-ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Link, router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { SubmissionDocumentDraftPageProps } from "./document-detail-draft-page.type";

const SubmissionDocumentDraftPage: SubmissionDocumentDraftPageProps = ({ submission }) => {
    console.log(submission);

    const handleDelete = (docId: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus dokumen ini?")) {
            router.delete(`/document-draft/${docId}`, {
                onSuccess: () => alert("Dokumen berhasil dihapus"),
            });
        }
    };

    const handleExportPdf = (docId: number) => {
        window.open(`/manager/submission-management/document-draft/export-pdf/${docId}`, "_blank");
    };

    const handleUploadToS3 = (docId: number) => {
        router.post(
            `/submission-management/document-draft/upload-s3/${docId}`,
            {},
            {
                onSuccess: () => alert("Dokumen berhasil diunggah ke S3"),
            },
        );
    };

    return (
        <main className="space-y-6">
            <section className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-800">Dokumen Terkait</h2>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/2">Nama Dokumen</TableHead>
                            <TableHead className="w-1/3 text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submission?.map((doc: any) => (
                            <TableRow key={doc.id}>
                                <TableCell>{doc.name}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="flex h-8 w-8 p-0 group">
                                                <DotsHorizontalIcon className="h-4 w-4" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-36 mr-8 mt-1">
                                            <DropdownMenuItem asChild>
                                                <a href={doc.url} target="_blank" className="cursor-pointer">
                                                    View
                                                </a>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() => handleExportPdf(doc.id)}
                                                className="cursor-pointer">
                                                Save as PDF
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() => handleUploadToS3(doc.id)}
                                                className="cursor-pointer">
                                                Upload to S3
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() => handleDelete(doc.id)}
                                                className="cursor-pointer text-red-600">
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    {/* <TableBody>
            {submission?.submissionDocs.map((doc: any) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex h-8 w-8 p-0 group">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36 mr-8 mt-1">
                      <DropdownMenuItem asChild>
                        <a href={doc.url} target="_blank" className="cursor-pointer">
                          View
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => handleExportPdf(doc.id)} className="cursor-pointer">
                        Save as PDF
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => handleUploadToS3(doc.id)} className="cursor-pointer">
                        Upload to S3
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem onClick={() => handleDelete(doc.id)} className="cursor-pointer text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody> */}
                </Table>
            </section>
        </main>
    );
};

export default SubmissionDocumentDraftPage;

SubmissionDocumentDraftPage.layout = (page: any) => {
    const pagePropsData = page.props;

    return (
        <RoleBasedLayout propsData={pagePropsData}>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                {pagePropsData?.page_settings?.title ?? "Detail Dokumen Pengajuan"}
            </h1>
            {page}
        </RoleBasedLayout>
    );
};
