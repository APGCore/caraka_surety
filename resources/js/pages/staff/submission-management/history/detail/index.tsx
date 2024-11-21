import SecondaryButton from "@/components/common/secondary-button";
import TinyMCEEditor from "@/components/documents/TinyMCEEditor";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/layouts/admin";
import StaffLayoutPage from "@/layouts/staff";
import templateDraftSurety from "@/pages/output_templates/template-draft-surety";
import templateAnalyst from "@/pages/output_templates/template-hasil-analisa";
import templateContent from "@/pages/output_templates/template-surat-pelaksanaan";
import secondTemplateContent from "@/pages/output_templates/template-surat-permohonan-surety-bond-bumida";
import { Head, Link } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
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

  const viewDocument = (url: string) => {
    window.open(url, "_blank");
  };

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

  const [content, setContent] = useState("<p>Ini adalah konten awal</p>");

  const currentDate = new Date();
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = currentDate.toLocaleDateString("id-ID", options).toUpperCase();

  const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(Number(value));
  };

  const replaceTemplatePlaceholders = (template: string, data: any) => {
    return template
      .replace("[TGL_PENGAJUAN]", data.created_at)
      .replace("[NAMA_TERJAMIN]", data.principal.name)
      .replace("[ALAMAT_TERJAMIN]", data.principal.address)
      .replace("[NPWP]", data.principal.npwp)
      .replace("[NIB]", data.principal.nib)
      .replace("[NAMA_OBLIGEE]", data.obligee.name)
      .replace("[ALAMAT_OBLIGEE]", data.obligee.address)
      .replace("[NILAI_KONTRAK]", formatCurrency(data.contract_value))
      .replace("[NILAI_JAMINAN]", formatCurrency(data.guarantee_value))
      .replace("[JANGKA_WAKTU]", data.time_period)
      .replace("[NAMA_PEKERJAAN]", data.job_name)
      .replace("[LOKASI_PROYEK]", data.location)
      .replace("[JENIS_JAMINAN]", data.guarantee_type)
      .replace("[TANGGAL]", formattedDate)
      .replace("[SUMBER_DANA]", data.obligee.source_of_fund);
  };

  const data = {
    principal: {
      name: submission.principal?.name,
      address: submission.principal?.address,
      npwp: submission.principal?.npwp,
      nib: submission.principal?.nib,
    },
    obligee: {
      address: submission.obligee.address,
      name: submission.obligee.name,
      source_of_fund: submission.source_of_fund.name,
    },
    contract_value: submission.contract_value,
    guarantee_value: submission.guarantee_value,
    guarantee_type: submission.guarantor_to_product_type.name,
    time_period: submission.time_period,
    job_name: submission.job_name,
    location: submission.job_location_village,
    // created_date: submission.created_at,
  };

  const initialContent = replaceTemplatePlaceholders(templateAnalyst, data);

  console.log(submission);

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

        <Tabs defaultValue="contract" className="w-full">
          <TabsList className="flex space-x-2">
            <TabsTrigger value="contract" className="flex-1">
              Data Kontrak
            </TabsTrigger>
            <TabsTrigger value="submitted" className="flex-1">
              Data Dokumen
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contract">
            {/* Tabel Detail Data */}
            <div>
              <h2 className="text-lg font-semibold mb-4 mt-5">Data Pribadi Perusahaan</h2>
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
              <h2 className="text-lg font-semibold mb-4 mt-5">Data Kontrak</h2>
              <table className="table-fixed w-full border border-gray-300">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-semibold w-1/2">Produk</td>
                    <td className="p-2 w-1/2">{submission.guarantor_to_product_type.name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold w-1/2">Jenis Jaminan</td>
                    <td className="p-2 w-1/2">{submission.guarantor_to_product_type.full_name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold w-1/2">Nama Obligee</td>
                    <td className="p-2 w-1/2">{submission.obligee.name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold w-1/2">Alamat Obligee</td>
                    <td className="p-2 w-1/2">{submission.obligee.address}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold w-1/2">Jenis Dokumen</td>
                    <td className="p-2 w-1/2">{submission.contract_doc_name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold w-1/2">Nomor Dokumen</td>
                    <td className="p-2 w-1/2">{submission.contract_doc_number}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold w-1/2">Tanggal Dokumen</td>
                    <td className="p-2 w-1/2">
                      {new Date(submission.contract_doc_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
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
                    <td className="p-2 font-semibold w-1/2">Jangka Waktu</td>
                    <td className="p-2 w-1/2">{submission.time_period} hari</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold w-1/2">Nama Pekerjaan</td>
                    <td className="p-2 w-1/2">{submission.job_name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold w-1/2">Tanggal Terbit Jaminan</td>
                    <td className="p-2 w-1/2">
                      {new Date(submission.guarantee_issue_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold w-1/2">Lokasi Proyek</td>
                    <td className="p-2 w-1/2">{submission.job_location}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold w-1/2">Sumber Dana</td>
                    <td className="p-2 w-1/2">{submission.source_of_fund.name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold w-1/2">Kelompok Pekerjaan</td>
                    <td className="p-2 w-1/2">{submission.guarantor_to_product_type.job_group}</td>
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

            {/* List Scoring Result */}
            <div>
              <h2 className="text-lg font-semibold mb-4 mt-5">Data Scores</h2>
              <table className="table-fixed w-full border border-gray-300">
                <thead>
                  <tr className="border-b bg-gray-100">
                    <th className="p-2 font-semibold text-left w-1/12">ID</th>
                    <th className="p-2 font-semibold text-left w-2/12">Point</th>
                    <th className="p-2 font-semibold text-left">Question Name</th>
                    <th className="p-2 font-semibold text-left">Opsi</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    submission.scores.reduce((grouped, score) => {
                      if (!grouped[score.category_name]) {
                        grouped[score.category_name] = [];
                      }
                      grouped[score.category_name].push(score);
                      return grouped;
                    }, {}),
                  ).map(([categoryName, scores]) => (
                    <React.Fragment key={categoryName}>
                      <tr className="border-b bg-gray-200">
                        <td colSpan={4} className="p-2 font-bold">
                          {categoryName}
                        </td>
                      </tr>
                      {scores.map((score) => (
                        <tr key={score.id} className="border-b">
                          <td className="p-2 text-left w-1/12">{score.id}</td>
                          <td className="p-2 text-left w-2/12">{score.point}</td>
                          <td className="p-2 text-left">{score.question_name}</td>
                          <td className="p-2 text-left">{score.option_name}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            <TinyMCEEditor id="example-editor" initialContent={initialContent} />
          </TabsContent>

          <TabsContent value="submitted">
            {/* List Dokumen */}
            <div>
              <h2 className="text-lg font-semibold mb-4 mt-5">Dokumen yang Diunggah</h2>
              {submission.submission_docs && submission.submission_docs.length > 0 ? (
                <table className="table-fixed w-full border border-gray-300">
                  <thead>
                    <tr className="border-b bg-gray-100">
                      <th className="p-2 text-left">Nama Dokumen</th>
                      <th className="p-2 text-left">Deskripsi</th>
                      <th className="p-2 text-left">Status</th>
                      <th className="p-2 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submission.submission_docs.map((doc) => (
                      <tr key={doc.id} className="border-b">
                        <td className="p-2">{doc.name}</td>
                        <td className="p-2">{doc.description || "-"}</td>
                        <td className="p-2">{doc.status || "Tidak ada status"}</td>
                        <td className="p-2">
                          <button onClick={() => viewDocument(doc.url)} className="text-blue-500 hover:underline">
                            Lihat Dokumen
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">Tidak ada dokumen yang diunggah.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
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
