import SecondaryButton from "@/components/common/secondary-button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/layouts/admin";
import StaffLayoutPage from "@/layouts/staff";
import templateDraftSurety from "@/pages/output_templates/template-draft-surety";
import templateAnalyst from "@/pages/output_templates/template-hasil-analisa";
import templateContent from "@/pages/output_templates/template-surat-pelaksanaan";
import secondTemplateContent from "@/pages/output_templates/template-surat-permohonan-surety-bond-bumida";
import { Head, Link } from "@inertiajs/react";
import React, { useEffect } from "react";
import { SubmissionDetailPageProps } from "./submission-detail-page.type";

const SubmissionDetailPage: SubmissionDetailPageProps = ({ submission }) => {
  useEffect(() => {
    const tinymceScript = document.createElement("script");
    tinymceScript.src = "/js/tinymce/tinymce.min.js";

    const htmlDocxScript = document.createElement("script");
    htmlDocxScript.src = "https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js";

    tinymceScript.onload = () => {
      const setupEditor = (selector: string, editorId: string, template: string) => {
        window.tinymce.init({
          selector,
          height: 500,
          plugins: "link image code",
          toolbar: "undo redo | bold italic | alignleft aligncenter alignright | code | exportToWordButton",
          promotion: false,
          branding: false,
          setup: (editor: any) => {
            editor.ui.registry.addButton("exportToWordButton", {
              text: "Export to Word",
              onAction: () => exportToWord(editorId),
            });

            editor.on("init", () => {
              editor.setContent(template);
            });
          },
        });
      };

      setupEditor("#surat-pelaksanaan", "surat-pelaksanaan", templateContent);
      setupEditor("#surat-permohonan", "surat-permohonan", secondTemplateContent);
      setupEditor("#hasil-analisa", "hasil-analisa", templateAnalyst);
      setupEditor("#draft-surety", "draft-surety", templateDraftSurety);
    };

    document.body.appendChild(tinymceScript);
    document.body.appendChild(htmlDocxScript);

    return () => {
      document.body.removeChild(tinymceScript);
      document.body.removeChild(htmlDocxScript);
    };
  }, []);

  const exportToWord = (editorId: string) => {
    const editorContent = window.tinymce.get(editorId).getContent();
    const converted = window.htmlDocx.asBlob(editorContent);

    const link = document.createElement("a");
    link.href = URL.createObjectURL(converted);
    link.download = `${editorId}-document.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="space-y-5">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Detail Pengajuan</h1>
        <SecondaryButton>
          <Link href={route("staff-submission-history.submission")}>Kembali</Link>
        </SecondaryButton>
      </div>
      <div className="border rounded-lg p-4 space-y-6 bg-white">
        {/* Status */}
        <div>
          <h2>
            <strong>Status:</strong>{" "}
            <span
              className={`px-2 py-1 text-xs font-semibold rounded ${
                status === "Approved"
                  ? "bg-green-100 text-green-800"
                  : status === "Rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              } uppercase`}>
              {submission.status}
            </span>
          </h2>
        </div>

        {/* Tabel Detail Data */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Data Pribadi Perusahaan</h2>
          <table className="table-fixed w-full border border-gray-300">
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Nama Perusahaan</td>
                <td className="p-2 w-1/2">{submission.principal?.name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Alamat Perusahaan</td>
                <td className="p-2 w-1/2">{submission.principal?.address}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">NPWP</td>
                <td className="p-2 w-1/2">{submission.principal?.npwp}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">No Telp Perusahaan</td>
                <td className="p-2 w-1/2">{submission.principal?.telephone}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">NIB</td>
                <td className="p-2 w-1/2">{submission.principal?.nib}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">SIUP / SIUJK</td>
                <td className="p-2 w-1/2">{submission.principal?.siup_siujk}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Nama Direksi</td>
                <td className="p-2 w-1/2">{submission.principal?.director_name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Jabatan</td>
                <td className="p-2 w-1/2">{submission.principal?.director_position}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Nomor Handphone</td>
                <td className="p-2 w-1/2">{submission.principal?.director_phone}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Komisaris</td>
                <td className="p-2 w-1/2">{submission.principal?.commissioner}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Data Kontrak */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Data Kontrak</h2>
          <table className="table-fixed w-full border border-gray-300">
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Nilai Kontrak</td>
                <td className="p-2 w-1/2">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(submission.contract_value)}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Nilai Jaminan</td>
                <td className="p-2 w-1/2">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(submission.guarantee_value)}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Lokasi Pekerjaan</td>
                <td className="p-2 w-1/2">{submission.job_location_village}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Mulai Tanggal</td>
                <td className="p-2 w-1/2">
                  {new Date(submission.start_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold w-1/2">Selesai Tanggal</td>
                <td className="p-2 w-1/2">
                  {new Date(submission.end_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default SubmissionDetailPage;

SubmissionDetailPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <StaffLayoutPage user={pagePropsData?.auth?.user}>
      <Head title={`Detail Pengajuan - ${pagePropsData?.submission?.companyName ?? "Pengajuan"}`} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("submission.index")}>Kelola Pengajuan</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </StaffLayoutPage>
  );
};
