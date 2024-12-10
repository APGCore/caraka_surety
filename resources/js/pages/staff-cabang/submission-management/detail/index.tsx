import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/layouts/admin";
import { Head, Link } from "@inertiajs/react";
import { useEffect } from "react";
// import templateDraftSurety from "../template-draft-surety";
// import templateAnalyst from "../template-hasil-analisa";
// import templateContent from "../template-surat-pelaksanaan";
// import secondTemplateContent from "../template-surat-permohonan";
import { SubmissionDetailPageProps } from "./submission-detail-page.type";

const SubmissionDetailPage: SubmissionDetailPageProps = ({ submission, status }) => {
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

      // setupEditor("#surat-pelaksanaan", "surat-pelaksanaan", templateContent);
      // setupEditor("#surat-permohonan", "surat-permohonan", secondTemplateContent);
      // setupEditor("#hasil-analisa", "hasil-analisa", templateAnalyst);
      // setupEditor("#draft-surety", "draft-surety", templateDraftSurety);
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
      <h1 className="text-2xl font-semibold">Detail Pengajuan</h1>
      <div className="border rounded-lg p-4 space-y-4 bg-white">
        <div>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${
              status === "Approved"
                ? "bg-green-100 text-green-800"
                : status === "Rejected"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}>
            {status}
          </span>
        </div>
        <div>
          <strong>Nama Perusahaan :</strong> <span>{submission}</span>
        </div>
        <div>
          <strong>Alamat Perusahaan:</strong> <span>{submission}</span>
        </div>
        <div>
          <strong>NPWP :</strong> <span>{submission}</span>
        </div>
        <div>
          <strong>No Telp Perusahaan:</strong> <span>{submission}</span>
        </div>
        <div>
          <strong>NIB :</strong> <span>{submission}</span>
        </div>
        <div>
          <strong>SIUP / SIUJK :</strong> <span>{submission}</span>
        </div>
        <div>
          <strong>Nama Direksi :</strong> <span>{submission}</span>
        </div>
        <div>
          <strong>Jabatan :</strong> <span>{submission}</span>
        </div>
        <div>
          <strong>Nomor Handphone :</strong> <span>{submission}</span>
        </div>
        <div>
          <strong>Komisiaris :</strong> <span>{submission}</span>
        </div>
        <div>
          <strong>Perusahaan Berdiri Tahun :</strong> <span>{submission}</span>
        </div>
        <div>
          <strong>Akte Perubahan Terakhir :</strong> <span>{submission}</span>
        </div>
        <div>
          <strong>Detail Pengajuan:</strong>
          <p>{submission}</p>
        </div>
      </div>
      <h1 className="text-2xl font-semibold">Output Surat</h1>
      <p className="text-xl font-semibold">Jaminan Pelaksanaan</p>
      <textarea id="surat-pelaksanaan"></textarea>
      <br />
      <p className="text-xl font-semibold">Surat Permohonan</p>
      <textarea id="surat-permohonan"></textarea>
      <br />
      <p className="text-xl font-semibold">Hasil Analisa</p>
      <textarea id="hasil-analisa"></textarea>
      <br />
      <p className="text-xl font-semibold">Draft Surety</p>
      <textarea id="draft-surety"></textarea>

      <div className="flex justify-end gap-3">
        <Button asChild>
          <Link href={route("submission.index")}>Kembali</Link>
        </Button>
      </div>
    </main>
  );
};

export default SubmissionDetailPage;

SubmissionDetailPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <Head title={`Detail Pengajuan - ${pagePropsData?.submission?.applicant_name ?? "Pengajuan"}`} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("submission.index")}>Kelola Pengajuan</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </AdminLayout>
  );
};
