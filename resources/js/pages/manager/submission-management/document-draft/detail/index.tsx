import { Button } from "@/components/_shadcn-ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Link } from "@inertiajs/react";
import { SubmissionDocumentDraftPageProps } from "./document-detail-draft-page.type";

const SubmissionDocumentDraftPage: SubmissionDocumentDraftPageProps = ({ submission }) => {
  if (!submission) {
    return (
      <main className="space-y-2.5 text-center text-gray-600">
        <p>Data submission tidak ditemukan.</p>
      </main>
    );
  }

  console.log(submission);

  return (
    <main className="space-y-6">
      {/* Informasi Detail Submission */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800">Detail Pengajuan</h2>
        <Table>
          <TableBody>
            <TableRow>
              <TableHead className="w-40">Nama Pemohon</TableHead>
              <TableCell>{submission.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Tanggal Pengajuan</TableHead>
              <TableCell>{submission.created_at}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Status</TableHead>
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
            </TableRow>
            <TableRow>
              <TableHead>Principal</TableHead>
              <TableCell>{submission.principal?.name ?? "Tidak ada data"}</TableCell>
            </TableRow>
            <TableRow>
              <TableHead>Guarantor & Produk</TableHead>
              <TableCell>{submission.guarantorToProductType?.name ?? "Tidak ada data"}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      {/* Dokumen yang Terkait dengan Submission */}
      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800">Dokumen Pengajuan</h2>
        {submission?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Nama Dokumen</TableHead>
                <TableHead>Opsi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submission?.map((doc: any, index: number) => (
                <TableRow key={doc.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>
                    <Link
                      href={route("manager-submission-docs.download", { id: doc.id })}
                      className="text-blue-600 hover:underline">
                      Unduh
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-600">Belum ada dokumen terkait.</p>
        )}
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
