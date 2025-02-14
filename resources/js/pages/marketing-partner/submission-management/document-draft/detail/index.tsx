import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import TinyMCEEditor from "@/components/documents/tiny-mce-editor";
import RoleBasedLayout from "@/layouts/role-based-layout";
import templateDraftSurety from "@/pages/output_templates/template-draft-surety";
import templateAnalyst from "@/pages/output_templates/template-hasil-analisa";
// import templateAnalyst from "@/pages/output_templates/template-hasil-analisa";
import templatePelaksanaan from "@/pages/output_templates/template-surat-pelaksanaan";
import templatePermohonan from "@/pages/output_templates/template-surat-permohonan-surety-bond-bumida";
import { Head } from "@inertiajs/react";
import { useEffect } from "react";
import { SubmissionDetailPageProps } from "./submission-detail-page.type";

const SubmissionDetailPage: SubmissionDetailPageProps = ({ submission }) => {
  const data = {
    principal: {
      name: submission.principal?.name,
      address: submission.principal?.address,
      npwp: submission.principal?.npwp,
      nib: submission.principal?.nib,
    },
    // obligee: {
    //   address: submission.obligee.address,
    //   name: submission.obligee.name,
    //   source_of_fund: submission.source_of_fund.name,
    // },
    // contract_value: submission.contract_value,
    // guarantee_value: submission.guarantee_value,
    // location: submission.job_location_village,
    // created_date: submission.created_at,
  };

  useEffect(() => {
    const tinymceScript = document.createElement("script");
    tinymceScript.src = "/js/tinymce/tinymce.min.js";
    tinymceScript.async = true;
    tinymceScript.defer = true;

    const htmlDocxScript = document.createElement("script");
    htmlDocxScript.src = "https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js";
    htmlDocxScript.async = true;
    htmlDocxScript.defer = true;

    // Function to initialize TinyMCE editors after scripts are loaded
    const setupEditors = () => {
      // Function to initialize a single editor
      const setupEditor = (selector: string, editorId: string, template: string) => {
        console.log(`Initializing editor for: ${editorId}`);

        // Ensure that the selector element exists in the DOM before initializing
        const editorElement = document.querySelector(selector);
        if (editorElement) {
          console.log(`Found element for ${editorId}, initializing TinyMCE...`);
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
                console.log(`Editor ${editorId} initialized with content:`, template);
                editor.setContent(template);
              });
            },
          });
        } else {
          console.warn(`Element for ${editorId} not found, skipping initialization.`);
        }
      };

      setupEditor("#surat-pelaksanaan", "surat-pelaksanaan", replacePelaksanaanPlaceholders(templatePelaksanaan, data));
      setupEditor("#surat-permohonan", "surat-permohonan", replacePermohonanPlaceholders(templatePermohonan, data));
      setupEditor("#hasil-analisa", "hasil-analisa", replaceAnalystPlaceholders(templateAnalyst, data));
      setupEditor("#draft-surety", "draft-surety", replaceDraftSuretyPlaceholders(templateDraftSurety, data));
    };

    tinymceScript.onload = () => {
      htmlDocxScript.onload = () => {
        setupEditors(); // Call setup editors after both scripts are loaded
      };
      document.body.appendChild(htmlDocxScript); // Append htmlDocxScript after tinymceScript is loaded
    };

    // Append tinymceScript to the body
    document.body.appendChild(tinymceScript);

    return () => {
      document.body.removeChild(tinymceScript);
      //   document.body.removeChild(htmlDocxScript);
    };
  }, [data]);

  console.log(submission);

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

  const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(Number(value));
  };

  const replacePelaksanaanPlaceholders = (template: string, data: any) => {
    return template
      .replace("[TGL_PENGAJUAN]", data.created_at)
      .replace("[NAMA_PRINCIPAL]", data.principal.name)
      .replace("[ALAMAT_TERJAMIN]", data.principal.address)
      .replace("[NPWP]", data.principal.npwp)
      .replace("[NILAI_JAMINAN]", formatCurrency(data.guarantee_value))
      .replace("[JANGKA_WAKTU]", data.time_period)
      .replace("[NAMA_PEKERJAAN]", data.job_name)
      .replace("[LOKASI_PROYEK]", data.location);
  };

  const replacePermohonanPlaceholders = (template: string, data: any) => {
    return template
      .replace("[TGL_PENGAJUAN]", data.created_at)
      .replace("[NAMA_OBLIGEE]", data.principal.name)
      .replace("[ALAMAT_TERJAMIN]", data.principal.address)
      .replace("[NPWP]", data.principal.npwp)
      .replace("[NIB]", data.principal.nib)
      .replace("[NAMA_PEKERJAAN]", data.job_name)
      .replace("[NILAI_JAMINAN]", formatCurrency(data.guarantee_value))
      .replace("[JANGKA_WAKTU]", data.time_period);
  };

  const replaceAnalystPlaceholders = (template: string, data: any) => {
    return template
      .replace("[TGL_PENGAJUAN]", data.created_at)
      .replace("[NAMA_TERJAMIN]", data.principal.name)
      .replace("[ALAMAT_TERJAMIN]", data.principal.address)
      .replace("[NPWP]", data.principal.npwp)
      .replace("[JENIS_JAMINAN]", data.guarantee_type)
      .replace("[NILAI_KONTRAK]", formatCurrency(data.contract_value))
      .replace("[NILAI_JAMINAN]", formatCurrency(data.guarantee_value))
      .replace("[JANGKA_WAKTU]", data.time_period)
      .replace("[LOKASI_PROYEK]", data.location);
  };

  const replaceDraftSuretyPlaceholders = (template: string, data: any) => {
    return template
      .replace("[TGL_PENGAJUAN]", data.created_at)
      .replace("[NAMA_TERJAMIN]", data.principal.name)
      .replace("[NPWP]", data.principal.npwp)
      .replace("[NAMA_PEKERJAAN]", data.job_name)
      .replace("[NILAI_KONTRAK]", formatCurrency(data.contract_value))
      .replace("[NILAI_JAMINAN]", formatCurrency(data.guarantee_value))
      .replace("[JANGKA_WAKTU]", data.time_period)
      .replace("[LOKASI_PROYEK]", data.location);
  };

  return (
    <main className="space-y-5">
      <h1 className="text-2xl font-semibold">Detail Pengajuan</h1>
      <div className="border rounded-lg p-4 space-y-4 bg-white">
        <div>
          <strong>Status:</strong>{" "}
          <span
            className={`px-2 py-1 text-xs font-semibold rounded ${
              submission.status === "approved"
                ? "bg-green-100 text-green-800"
                : submission.status === "rejected"
                  ? "bg-red-100 text-red-800"
                  : submission.status === "process"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
            }`}>
            {submission.status === "approved"
              ? "DISETUJUI"
              : submission.status === "rejected"
                ? "DITOLAK"
                : submission.status === "process"
                  ? "PROSES"
                  : "Unknown"}
          </span>
        </div>
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
      <h1 className="text-2xl font-semibold">Output Surat</h1>
      {/* <div>
        {submission.status === "approved" ? (
          <>
            <p className="text-xl font-semibold">Jaminan Pelaksanaan</p>
            <TinyMCEEditor
              id="surat-pelaksanaan"
              initialContent={replacePelaksanaanPlaceholders(templatePelaksanaan, data)}
            />
            <br />
            <p className="text-xl font-semibold">Surat Permohonan</p>
            <TinyMCEEditor
              id="surat-permohonan"
              initialContent={replacePermohonanPlaceholders(templatePermohonan, data)}
            />
            <br />
            <p className="text-xl font-semibold">Draft Surety Bond</p>
            <TinyMCEEditor
              id="draft-surety"
              initialContent={replaceDraftSuretyPlaceholders(templateDraftSurety, data)}
            />
          </>
        ) : (
          <p className="text-red-500 text-lg font-semibold">Pengajuan belum diterima</p>
        )}
      </div> */}
      <div>
        <p className="text-xl font-semibold">Jaminan Pelaksanaan</p>
        <TinyMCEEditor
          id="surat-pelaksanaan"
          initialContent={replacePelaksanaanPlaceholders(templatePelaksanaan, data)}
        />
        <br />
        <p className="text-xl font-semibold">Surat Permohonan</p>
        <TinyMCEEditor id="surat-permohonan" initialContent={replacePermohonanPlaceholders(templatePermohonan, data)} />
        <br />
        <p className="text-xl font-semibold">Draft Surety Bond</p>
        <TinyMCEEditor id="draft-surety" initialContent={replaceDraftSuretyPlaceholders(templateDraftSurety, data)} />
      </div>
    </main>
  );
};

export default SubmissionDetailPage;

SubmissionDetailPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <Head title={`Detail Pengajuan - ${pagePropsData?.submission?.applicant_name ?? "Pengajuan"}`} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("submission.index")}>Kelola Pengajuan</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </RoleBasedLayout>
  );
};
