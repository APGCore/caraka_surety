import { useCompareRatios } from "@/common/hooks/general/use-compare-ratios";
import useStepper from "@/common/hooks/general/use-stepper";
import { cn } from "@/common/utils/cn";
import { formatCurrency } from "@/common/utils/format-currency";
import { Alert, AlertDescription, AlertTitle } from "@/components/_shadcn-ui/alert";
import { Badge } from "@/components/_shadcn-ui/badge";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import TinyMCEEditor from "@/components/documents/tiny-mce-editor";
import { PreviewFile } from "@/components/molecules/preview-file";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { SubmissionStatus } from "@/types/submission-status";
import axios from "axios";
import debounce from "lodash/debounce";
import React, { Fragment, useEffect, useRef } from "react";
import SubmissionDetailHeader from "./_partials/create-page-header";
import { SubmissionDetailPageProps } from "./submission-detail-page.type";

export type TFormDetailStep = "principal" | "docs" | "contract" | "skoring" | "luaran";
type TFormDetailStepperIndicator = {
  title: string;
  name: TFormDetailStep;
  isActive: boolean;
};

const initialSteps: Array<TFormDetailStepperIndicator> = [
  {
    title: "Profile Perusahaan",
    name: "principal",
    isActive: true,
  },
  {
    title: "Review Dokumen Perusahaan",
    name: "docs",
    isActive: false,
  },
  {
    title: "Detail Kontrak dan Dasar Pengajuan",
    name: "contract",
    isActive: false,
  },
  {
    title: "Review Hasil Resume dan Skoring",
    name: "skoring",
    isActive: false,
  },
  {
    title: "Persetujuan Pengajuan",
    name: "luaran",
    isActive: false,
  },
];

const SubmissionDetailPage: SubmissionDetailPageProps = ({ submission }) => {
  useEffect(() => {
    handleComparisonRatios(submission?.principal?.ratios);
  }, []);

  const currentDate = new Date();
  const options = { year: "numeric" as const, month: "long" as const, day: "numeric" as const };
  //   const formattedDate = currentDate.toLocaleDateString("id-ID", options).toUpperCase();
  const isProcess = submission?.status == SubmissionStatus.PROCESS;
  const isApproved = submission?.status == SubmissionStatus.APPROVED;
  const isRejected = submission?.status == SubmissionStatus.REJECTED;

  const filteredSubmission = isApproved ? initialSteps : initialSteps?.slice(0, 4);

  const { currentStep, steps, gotoStep } = useStepper(filteredSubmission);

  //   DOCUMENTS FORMAT
  interface SubmissionData {
    principal_name: string;
    location: string;
    npwp: string;
    nib: string;
    telephone: string;
    director_name: string;
    director_phone: string;
    bussiness_field: string;
    principal_commissioner: string;
    pic: string;
    director_position: string;
    principal_address: string;
    est_deed: string;
    last_deed: string;
    get_susunan_pengurus: string;
    get_exp: string;

    bank_name: string;
    obligee_name: string;
    obligee_address: string;
    source_of_fund: string;
    ppk_name: string;
    ppk_number: string;
    obligee_city: string;
    obligee_location: string;

    guarantor_name: string;
    guarantor_address: string;
    guarantor_pic: string;
    guarantor_location: string;

    source_of_fund_name: string;
    contract_value: string | number;
    guarantee_value: string | number;
    guarantee_type: string;
    no_guarantee: string;
    time_period: string | number;
    job_name: string;
    job_location_village: string;
    contract_doc_name: string;
    contract_doc_number: string;
    contract_doc_date: string;
    start_date: string;
    end_date: string;
    guarantee_issue_date: string;
    submission_date: string;
    day: string;

    character_score: string | number;
    capacity_score: string | number;
    capital_score: string | number;
    collateral_score: string | number;
    condition_score: string | number;
    total_score: string | number;
    recommendation: string;
    notes: string;
    analyst_name: string;
    manager_technique_name: string;

    branch_manager: string;
    job_location: string;
    job_group: string;
    no: string | number;
    city: string;
    mail_number: string;
    mail_number_resume: string;
    underlying: string;
    product_name: string;

    [key: string]: any;
  }

  const editorRefs = useRef<{ [key: string]: any }>({});

  // Fungsi untuk mengganti placeholder dalam template
  const replacePlaceholders = (template: string, data: SubmissionData): string => {
    return template.replace(/\[([A-Z_]+)]/g, (_, key: string) => {
      const value = data[key.toLowerCase()]; // Ambil nilai dari data berdasarkan key
      return value !== undefined ? value : `[${key}]`; // Kembalikan placeholder jika tidak ditemukan
    });
  };

  const dataTemplate: SubmissionData = {
    // Informasi Principal
    principal_name: submission?.principal?.name || "",
    location: submission?.principal?.address || "",
    npwp: submission?.principal?.npwp || "",
    nib: submission?.principal?.nib || "",
    telephone: submission?.principal?.telephone || "",
    director_name: submission?.principal?.director_name || "",
    director_phone: submission?.principal?.director_phone || "",
    bussiness_field: submission?.principal?.bussiness_field || "",
    principal_commissioner: submission?.principal?.commissioner || "",
    pic: submission?.principal?.pic || "",
    director_position: submission?.principal?.director_position || "",
    principal_address: `${submission?.principal?.address}, ${submission?.principal?.district?.name}, ${submission?.principal?.regency?.name}, ${submission.principal?.province?.name}`,
    est_deed: submission?.principal?.est_deed || "",
    last_deed: submission?.principal?.last_deed || "",
    get_susunan_pengurus: submission?.get_administators_principal || "",
    get_exp: submission?.get_exp || "",

    // Informasi Bank & Obligee
    bank_name: submission?.bank_name || "",
    obligee_name: submission?.obligee?.name || "",
    obligee_address: submission?.obligee?.address || "",
    source_of_fund: submission?.source_of_fund?.name || "",
    ppk_name: submission?.obligee?.pic || "",
    ppk_number: submission?.obligee?.no_ppk || "",
    obligee_city: submission?.obligee?.district?.name || "",
    obligee_location: `${submission?.obligee?.address}, ${submission?.obligee?.district?.name}, ${submission?.obligee?.regency?.name}, ${submission?.obligee?.province?.name}`,

    // Informasi Guarantor
    guarantor_name: submission?.guarantor?.name || "",
    guarantor_address: submission?.guarantor_address || "",
    guarantor_pic: submission?.guarantor?.pic || "",
    guarantor_location: `${submission?.guarantor?.address}, ${submission?.guarantor?.district?.name}, ${submission?.guarantor?.regency?.name}, ${submission?.guarantor?.province?.name}`,

    // Informasi Kontrak & Proyek
    source_of_fund_name: submission?.source_of_fund?.name || "",
    contract_value: submission?.contract_value_formatted || 0,
    guarantee_value: submission?.guarantee_value_formatted || 0,
    guarantee_type: submission?.guarantor_to_product_type?.name || "",
    no_guarantee: submission?.no_guarantee || "",
    time_period: submission?.time_period || "",
    job_name: submission?.job_name || "",
    job_location_village: submission?.job_location_village || "",
    contract_doc_name: submission?.contract_doc_name || "",
    contract_doc_number: submission?.contract_doc_number || "",
    contract_doc_date: submission?.contract_doc_date || "",
    start_date: submission?.start_date || "",
    end_date: submission?.end_date || "",
    guarantee_issue_date: submission?.guarantee_issue_date || "",
    submission_date: submission?.submission_date || "",
    day: submission?.day_name || "",

    // SCORING
    character_score: submission?.analysis?.character,
    capacity_score: submission?.analysis?.capacity,
    capital_score: submission?.analysis?.capital,
    collateral_score: submission?.analysis?.collateral,
    condition_score: submission?.analysis?.character,
    total_score: submission?.total_score,

    recommendation: submission?.recommendation,
    notes: submission?.notes,
    analyst_name: submission?.analyst_name || "",
    manager_technique_name: submission?.principal?.commissioner || "",

    // Informasi Tambahan
    branch_manager: submission.principal?.director_name || "",
    job_location: `${submission.job_location_village}, ${submission.district?.name}, ${submission.regency?.name}, ${submission.province?.name}`,
    job_group: submission.guarantor_to_product_type?.job_group || "",
    no: submission.id || "",
    city: submission.regency?.name || "",
    mail_number: submission.mail_number || "",
    mail_number_resume: submission.mail_number_resume || "",
    underlying: submission.contract_doc_name + " " + submission.contract_doc_number + " " + submission.job_name || "",
    product_name: submission?.product?.name || "",
  };

  const { comparisonRatios, handleComparisonRatios } = useCompareRatios();

  const handleSave = async (editorId: any, submissionId: any) => {
    const editor = editorRefs.current[editorId];
    if (editor) {
      const content = editor.getContent();

      try {
        const response = await axios.post("/staff/submission-management/save-content", {
          submission_id: submissionId,
          name: editorId,
          format_document: content,
        });

        alert(`Data dari editor "${editorId}" untuk submission ${submissionId} berhasil disimpan!`);
        console.log("Response Data:", response.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          // Error berasal dari Axios
          if (error.response) {
            console.error("Error Response:", error.response.data);
            alert("Gagal menyimpan data. Silakan coba lagi.");
          } else if (error.request) {
            console.error("No Response:", error.request);
            alert("Terjadi kesalahan jaringan. Silakan coba lagi.");
          } else {
            console.error("Axios Error:", error.message);
          }
        } else {
          // Error lainnya (bukan dari Axios)
          console.error("Unexpected Error:", error);
          alert("Terjadi kesalahan tak terduga. Silakan coba lagi.");
        }
      }
    } else {
      console.error(`Editor dengan ID "${editorId}" tidak ditemukan.`);
    }
  };

  type AutoSaveParams = {
    editorId: string;
    submissionId: number;
    content: string;
  };

  const handleAutoSave = debounce(
    async ({ editorId, submissionId, content }: AutoSaveParams) => {
      try {
        const response = await axios.post("/staff/submission-management/save-content", {
          submission_id: submissionId,
          editorId,
          format_document: content,
        });
        console.log(`Auto-saved for editor "${editorId}" (submission ID: ${submissionId}). Response:`, response.data);
      } catch (error) {
        console.error("Error saving content:", error);
      }
    },
    500, // Delay in milliseconds
  );

  return (
    <main className="space-y-10 w-[800px] mx-auto mt-[50px]">
      {/* STEPPER SECTION */}
      <div className="flex items-start">
        <RenderList
          of={steps}
          render={(step, index) => {
            return (
              <Fragment>
                {/* STEPPER BULLET */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    gotoStep(step);
                  }}
                  className="flex items-center cursor-pointer flex-col justify-center">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 bg-gray-300 text-gray-700",
                      {
                        "bg-black text-white": step.isActive,
                      },
                    )}>
                    {index + 1}
                  </div>

                  {/* STEPPER LABEL */}
                  <span
                    className={cn("transition-all duration-300 text-gray-500 mt-2 text-sm min-w-[100px]", {
                      "text-black font-semibold": step.isActive,
                    })}>
                    {step.title}
                  </span>
                </button>

                {/* ARROW BETWEEN STEPPER */}
                {index < steps.length - 1 && (
                  <div
                    className={cn("w-full mt-5 h-1 mx-5 transition-all duration-300 bg-gray-300", {
                      "bg-black": steps[index + 1].isActive,
                    })}
                  />
                )}
              </Fragment>
            );
          }}
        />
      </div>

      {/* TITLE DETAIL SECTION */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">{currentStep.title}</h1>
      </div>

      <div className="border rounded-sm p-4 space-y-6 bg-white">
        {/* STATUS */}
        <div>
          <Alert variant={isProcess ? "warning" : isApproved ? "success" : isRejected ? "destructive" : "default"}>
            <AlertTitle>Status</AlertTitle>
            <AlertDescription>
              <Show when={isProcess}>
                <span>Pengajuan sedang diproses {submission?.checked_at && "dan menunggu persetujuan"}</span>
              </Show>
              <Show when={isApproved}>
                <span>Pengajuan telah disetujui oleh {submission?.user_approved?.name}</span>
              </Show>
              <Show when={isRejected}>
                <span>Pengajuan ditolak oleh {submission?.user_rejected?.name}</span>
              </Show>
            </AlertDescription>
          </Alert>
        </div>
        <Show when={currentStep.name === "principal"}>
          <div>
            <table className="table-fixed w-full border border-gray-300">
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-semibold w-1/2">Nama Perusahaan</td>
                  <td className="p-2">: {submission?.principal?.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Alamat Perusahaan</td>
                  <td className="p-2">: {submission?.principal?.address}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">NPWP</td>
                  <td className="p-2">: {submission?.principal?.npwp}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">No Telp Perusahaan</td>
                  <td className="p-2">: {submission?.principal?.telephone}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">NIB</td>
                  <td className="p-2">: {submission?.principal?.nib}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Nama Direksi</td>
                  <td className="p-2">: {submission?.principal?.director_name}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Jabatan</td>
                  <td className="p-2">: {submission?.principal?.director_position}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Nomor Handphone</td>
                  <td className="p-2">: {submission?.principal?.director_phone}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Komisaris</td>
                  <td className="p-2">: {submission?.principal?.commissioner}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Show>
        <Show when={currentStep.name === "docs"}>
          {submission?.required_docs && submission?.required_docs.length > 0 ? (
            <table className="table-fixed w-full border border-gray-300">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-2 text-left">Nama Dokumen</th>
                  <th className="p-2 text-left">Deskripsi</th>
                  <th className="p-2 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <RenderList
                  of={submission?.required_docs}
                  render={(doc) => {
                    return (
                      <tr key={doc.id} className="border-b">
                        <td className="p-2">{doc.name}</td>
                        <td className="p-2">{doc.description || "-"}</td>
                        <td className="p-2">{doc?.url ? <PreviewFile preview={doc.url} /> : "File Belum Diunggah"}</td>
                      </tr>
                    );
                  }}
                />
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">Tidak ada dokumen yang diunggah.</p>
          )}
        </Show>
        <Show when={currentStep.name === "contract"}>
          <table className="table-fixed w-full border border-gray-300">
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Blanko yang Digunakan</td>
                <td className="p-2 ">: {submission?.blank?.number}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Produk</td>
                <td className="p-2 ">: {submission?.guarantor_to_product_type?.name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Jenis Jaminan</td>
                <td className="p-2">: {submission?.guarantor_to_product_type?.full_name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Nama Obligee</td>
                <td className="p-2">: {submission?.obligee?.name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Alamat Obligee</td>
                <td className="p-2">: {submission?.obligee?.address}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Jenis Dokumen</td>
                <td className="p-2">: {submission?.contract_doc_name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Nomor Dokumen</td>
                <td className="p-2">: {submission?.contract_doc_number}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Tanggal Dokumen</td>
                <td className="p-2">
                  :{" "}
                  {new Date(submission?.contract_doc_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Nilai Kontrak</td>
                <td className="p-2">
                  :{" "}
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(submission?.contract_value)}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Nilai Jaminan</td>
                <td className="p-2">
                  :{" "}
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(submission?.guarantee_value)}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Jangka Waktu</td>
                <td className="p-2">: {submission?.time_period} hari</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Nama Pekerjaan</td>
                <td className="p-2">: {submission?.job_name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Tanggal Terbit Jaminan</td>
                <td className="p-2">
                  :{" "}
                  {submission?.guarantee_issue_date &&
                    new Date(submission?.guarantee_issue_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Lokasi Proyek</td>
                <td className="p-2">: {dataTemplate?.job_location}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Sumber Dana</td>
                <td className="p-2">: {submission?.source_of_fund?.name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Kelompok Pekerjaan</td>
                <td className="p-2">: {submission?.guarantor_to_product_type?.job_group}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Mulai Tanggal</td>
                <td className="p-2">
                  :{" "}
                  {new Date(submission?.start_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Selesai Tanggal</td>
                <td className="p-2">
                  :{" "}
                  {new Date(submission?.end_date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </Show>
        <Show when={currentStep.name === "skoring"}>
          <div>
            <h2 className="text-lg font-semibold mb-4 mt-10">Analisis Rasio Keuangan Perusahaan</h2>

            <table className="table-fixed border w-full border-gray-300">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-2 font-semibold text-left w-1">Rasio</th>
                  <RenderList
                    of={submission?.principal?.ratios}
                    render={(ratio: any) => {
                      return <th className="p-2 font-semibold text-center w-1">{ratio.year}</th>;
                    }}
                  />
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-semibold text-left w-1">Aktiva Lancar</td>
                  <RenderList
                    of={submission?.principal?.ratios}
                    render={(ratio: any) => {
                      return (
                        <td className="p-2 font-semibold text-center w-1/2">{formatCurrency(ratio.current_assets)}</td>
                      );
                    }}
                  />
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold text-left w-1/2">Utang Lancar</td>
                  <RenderList
                    of={submission?.principal?.ratios}
                    render={(ratio: any) => {
                      return (
                        <td className="p-2 font-semibold text-center w-1/2">{formatCurrency(ratio.current_debt)}</td>
                      );
                    }}
                  />
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold text-left w-1/2">Total Utang</td>
                  <RenderList
                    of={submission?.principal?.ratios}
                    render={(ratio: any) => {
                      return (
                        <td className="p-2 font-semibold text-center w-1/2">{formatCurrency(ratio.total_debt)}</td>
                      );
                    }}
                  />
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold text-left w-1/2">Total Aktiva</td>
                  <RenderList
                    of={submission?.principal?.ratios}
                    render={(ratio: any) => {
                      return (
                        <td className="p-2 font-semibold text-center w-1/2">{formatCurrency(ratio.total_assets)}</td>
                      );
                    }}
                  />
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold text-left w-1/2">Pendapatan</td>
                  <RenderList
                    of={submission?.principal?.ratios}
                    render={(ratio: any) => {
                      return <td className="p-2 font-semibold text-center w-1/2">{formatCurrency(ratio.revenue)}</td>;
                    }}
                  />
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold text-left w-1/2">Laba Bersih</td>
                  <RenderList
                    of={submission?.principal?.ratios}
                    render={(ratio: any) => {
                      return (
                        <td className="p-2 font-semibold text-center w-1/2">{formatCurrency(ratio.net_income)}</td>
                      );
                    }}
                  />
                </tr>

                <tr className="border-b bg-gray-100">
                  <td className="p-2 font-semibold text-left">
                    Rasio Likuiditas
                    {comparisonRatios.liquidity_ratios == true && (
                      <Badge variant="success" className="flex-shrink-0 h-6 mx-2">
                        Naik
                      </Badge>
                    )}
                    {comparisonRatios.liquidity_ratios == false && (
                      <Badge variant="destructive" className="flex-shrink-0 h-6 mx-2">
                        Turun
                      </Badge>
                    )}
                  </td>
                  <RenderList
                    of={submission?.principal?.ratios}
                    render={(ratio: any) => {
                      return <td className="p-2 font-semibold text-center">{ratio.liquidity_ratios}</td>;
                    }}
                  />
                </tr>
                <tr className="border-b bg-gray-100">
                  <td className="p-2 font-semibold text-left">
                    Rasio Profitabilitas
                    {comparisonRatios.profitability_ratios == true && (
                      <Badge variant="success" className="flex-shrink-0 h-6 mx-2">
                        Naik
                      </Badge>
                    )}
                    {comparisonRatios.profitability_ratios == false && (
                      <Badge variant="destructive" className="flex-shrink-0 h-6 mx-2">
                        Turun
                      </Badge>
                    )}
                  </td>
                  <RenderList
                    of={submission?.principal?.ratios}
                    render={(ratio: any) => {
                      return <td className="p-2 font-semibold text-center">{ratio.profitability_ratios}%</td>;
                    }}
                  />
                </tr>
                <tr className="border-b bg-gray-100">
                  <td className="p-2 font-semibold text-left">
                    Rasio Solvabilitas
                    {comparisonRatios.solvency_ratios == true && (
                      <Badge variant="success" className="flex-shrink-0 h-6 mx-2">
                        Naik
                      </Badge>
                    )}
                    {comparisonRatios.solvency_ratios == false && (
                      <Badge variant="destructive" className="flex-shrink-0 h-6 mx-2">
                        Turun
                      </Badge>
                    )}
                  </td>
                  <RenderList
                    of={submission?.principal?.ratios}
                    render={(ratio: any) => {
                      return <td className="p-2 font-semibold text-center">{ratio.solvency_ratios}</td>;
                    }}
                  />
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4 mt-10">Hasil Skoring</h2>
            <table className="table-fixed w-full border border-gray-300">
              <thead>
                <tr className="border-b bg-gray-300">
                  <th className="p-2 font-semibold text-left w-[150pt]">Kategori Pertanyaan</th>
                  <th className="p-2 font-semibold text-left">Pertanyaan</th>
                  <th className="p-2 font-semibold text-left">Jawaban</th>
                  <th className="p-2 font-semibold text-center w-2/12">Point</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  submission?.scores.reduce((grouped: any, score: any) => {
                    const { scoring_question_category_id, scoring_question_category, ...rest } = score;
                    if (!grouped[scoring_question_category_id]) {
                      grouped[scoring_question_category_id] = {
                        ...scoring_question_category,
                        items: [],
                      };
                    }
                    grouped[scoring_question_category_id].items.push(rest);
                    return grouped;
                  }, {}),
                ).map(([id, scores]: [any, any]) => {
                  console.log("scores", scores.items);
                  return (
                    <React.Fragment key={id}>
                      <tr className="border-b bg-gray-100">
                        <td colSpan={4} className="p-2 font-bold">
                          {scores.name} ({scores.max_point})
                        </td>
                      </tr>
                      {scores.items.map((score: any) => (
                        <tr key={score.id} className="border-b">
                          <td className="p-2 text-left"></td>
                          <td className="p-2 text-left">{score.question_name}</td>
                          <td className="p-2 text-left">{score.scoring_option.name}</td>
                          <td className="p-2 text-center">{score.point}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td className="p-2" colSpan={3}>
                          Sub Total:
                        </td>
                        <td className="p-2 text-center">
                          {scores.items.reduce((total: number, score: any) => total + score.point, 0)}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>

              <tfoot>
                <tr className="border-b bg-gray-300">
                  <td className="p-2 font-semibold" colSpan={3}>
                    Total:
                  </td>
                  <td className="p-2 text-center">{submission?.total_score}</td>
                </tr>
                <tr>
                  <td
                    colSpan={4}
                    className={cn({
                      "p-2 text-center": true,
                      "bg-green-300": submission?.scores?.[0]?.scoring?.min_point < submission?.total_score,
                      "bg-red-300": submission?.scores?.[0]?.scoring?.min_point >= submission?.total_score,
                    })}>
                    <span className="pr-1">Disarankan Untuk</span>
                    {submission?.scores?.[0]?.scoring?.min_point < submission?.total_score ? (
                      <span className="text-green-800">
                        Disetujui Karena Nilai {submission?.total_score} Lebih Dari{" "}
                        {submission?.scores?.[0]?.scoring?.min_point}
                      </span>
                    ) : (
                      <span className="text-red-800">
                        Ditolak Karena
                        {" Nilai " +
                          submission?.total_score +
                          " Kurang Dari " +
                          submission?.scores?.[0]?.scoring?.min_point}
                      </span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Show>
        <Show when={currentStep.name === "luaran"}>
          <div>
            <h2 className="text-lg font-semibold mb-4 mt-5">Resume Analisa Penjaminan</h2>
            <div>
              <TinyMCEEditor
                id="hasil-analisis"
                onInit={(evt, editor) => (editorRefs.current["hasil-analisis"] = editor)}
                initialContent={replacePlaceholders(
                  submission?.document_format_analysis?.format_document,
                  dataTemplate,
                )}
              />
            </div>
          </div>
          <div>
            <div>
              {(() => {
                const documentsToDisplay: JSX.Element[] = [];

                // Untuk document_format_guarantor
                if (submission?.document_format_guarantor?.length) {
                  const filteredGuarantorDocs = submission.document_format_guarantor.filter(
                    (doc: any) => doc.product_id === null && doc.guarantor_to_product_type_id === null,
                  );
                  filteredGuarantorDocs.forEach((doc: any) => {
                    documentsToDisplay.push(
                      <div key={doc.id} style={{ marginBottom: "20px" }}>
                        <h3 className="text-lg font-semibold mb-4 mt-5">{doc.name}</h3>
                        <TinyMCEEditor
                          id={doc.name.replace(/\s+/g, "-").toLowerCase()}
                          initialContent={replacePlaceholders(doc.format_document, dataTemplate)}
                          onInit={(evt, editor) => (editorRefs.current[`editor-${doc.id}`] = editor)}
                        />
                      </div>,
                    );
                  });
                }

                // Untuk document_format_product
                if (submission?.document_format_product?.length) {
                  const filteredProductDocs = submission.document_format_product.filter(
                    (doc: any) => doc.guarantor_to_product_type_id === null,
                  );
                  filteredProductDocs.forEach((doc: any) => {
                    documentsToDisplay.push(
                      <div key={doc.id} style={{ marginBottom: "20px" }}>
                        <h3 className="text-lg font-semibold mb-4 mt-5">{doc.name}</h3>
                        <TinyMCEEditor
                          id={doc.name.replace(/\s+/g, "-").toLowerCase()}
                          initialContent={replacePlaceholders(doc.format_document, dataTemplate)}
                          onInit={(evt, editor) => (editorRefs.current[`editor-${doc.id}`] = editor)}
                        />
                      </div>,
                    );
                  });
                }

                // Untuk document_format_type_guarantee
                if (isApproved && submission?.document_format_type_guarantee?.length) {
                  const filteredDocs = submission.document_format_type_guarantee.filter(
                    (doc: any) =>
                      doc.guarantor_id !== null && doc.product_id !== null && doc.guarantor_to_product_type_id !== null,
                  );
                  filteredDocs.forEach((doc: any) => {
                    documentsToDisplay.push(
                      <div key={doc.id} style={{ marginBottom: "20px" }}>
                        <h3 className="text-lg font-semibold mb-4 mt-5">{doc.name}</h3>
                        <TinyMCEEditor
                          id={doc.name.replace(/\s+/g, "-").toLowerCase()}
                          initialContent={replacePlaceholders(doc.format_document, dataTemplate)}
                          onInit={(evt, editor) => (editorRefs.current[`editor-${doc.id}`] = editor)}
                        />
                      </div>,
                    );
                  });
                }

                if (documentsToDisplay.length > 0) {
                  return documentsToDisplay;
                }

                return <p className="text-gray-500">Tidak ada dokumen yang tersedia untuk ditampilkan.</p>;
              })()}
            </div>
          </div>

          {/* {submission?.guarantor_to_product_type?.full_name.toLowerCase().includes("bank") && (
            <div>
              <p className="text-xl font-semibold mb-4 mt-5">Surat Permohonan</p>
              <TinyMCEEditor
                id="surat-permohonan"
                onInit={(evt, editor) => (editorRefs.current["surat-permohonan"] = editor)}
                initialContent={replacePlaceholders(templateBankGaransi, dataTemplate)}
              />
            </div>
          )}
          {submission?.guarantor_to_product_type?.full_name.toLowerCase().includes("surety bond") && (
            <div>
              <p className="text-xl font-semibold mb-4 mt-5">Draft Surety Bond</p>
              <TinyMCEEditor
                id="draft-surety"
                onInit={(evt, editor) => (editorRefs.current["draft-surety"] = editor)}
                initialContent={replacePlaceholders(templateDraftSurety, dataTemplate)}
              />
            </div>
          )}
          {submission?.guarantor?.name.toLowerCase().includes("bumida") && (
            <div>
              <p className="text-xl font-semibold mb-4 mt-5">Bumida</p>
              <TinyMCEEditor
                id="draft-surety-bumida"
                onInit={(evt, editor) => (editorRefs.current["draft-surety-bumida"] = editor)}
                initialContent={replacePlaceholders(templateBumida, dataTemplate)}
              />
            </div>
          )}
          {submission?.guarantor?.name.toLowerCase().includes("jastan") ||
          submission?.guarantor?.name.toLowerCase().includes("jasa tania") ? (
            <div>
              <p className="text-xl font-semibold mb-4 mt-5">Jastan atau Jasa Tania</p>
              <TinyMCEEditor
                id="draft-surety-jastan"
                onInit={(evt, editor) => (editorRefs.current["draft-surety-jastan"] = editor)}
                initialContent={replacePlaceholders(templateJastan, dataTemplate)}
              />
            </div>
          ) : null}

          {submission?.guarantor?.name.toLowerCase().includes("videi") && (
            <div>
              <p className="text-xl font-semibold mb-4 mt-5">Videi</p>
              <TinyMCEEditor
                id="draft-surety-videi"
                onInit={(evt, editor) => (editorRefs.current["draft-surety-videi"] = editor)}
                initialContent={replacePlaceholders(templateVidei, dataTemplate)}
              />
            </div>
          )}

          {submission?.guarantor?.name.toLowerCase().includes("bumida") && (
            <div>
              <h2 className="text-lg font-semibold mb-4 mt-5">SPKMGR BUMIDA</h2>
              <div>
                <TinyMCEEditor
                  id="spkmgr-bumida"
                  onInit={(evt, editor) => (editorRefs.current["spkmgr-bumida"] = editor)}
                  initialContent={replacePlaceholders(templateSpkmgrBumida, dataTemplate)}
                />
              </div>
            </div>
          )}

          {submission?.guarantor?.name.toLowerCase().includes("jastan") ||
          submission?.guarantor?.name.toLowerCase().includes("jasa tania") ? (
            <div>
              <h2 className="text-lg font-semibold mb-4 mt-5">SPKMGR JASTAN</h2>
              <div>
                <TinyMCEEditor
                  id="spkmgr-jastan"
                  onInit={(evt, editor) => (editorRefs.current["spkmgr-jastan"] = editor)}
                  initialContent={replacePlaceholders(templateSpkmgrJastan, dataTemplate)}
                />
              </div>
            </div>
          ) : null}

          {submission?.guarantor?.name.toLowerCase().includes("videi") && (
            <div>
              <h2 className="text-lg font-semibold mb-4 mt-5">SPKMGR VIDEI</h2>
              <div>
                <TinyMCEEditor
                  id="spkmgr-videi"
                  onInit={(evt, editor) => (editorRefs.current["spkmgr-videi"] = editor)}
                  initialContent={replacePlaceholders(templateSpkmgrVidei, dataTemplate)}
                />
              </div>
            </div>
          )} */}

          {/* OUTPUT SURAT JAMINAN  */}

          {/* {isApproved && submission?.guarantor_to_product_type?.full_name.toLowerCase().includes("pemeliharaan") && (
            <div>
              <p className="text-xl font-semibold mb-4 mt-5">Jaminan Pemeliharaan</p>
              <TinyMCEEditor
                id="surat-pemeliharaan"
                onInit={(evt, editor) => (editorRefs.current["surat-pemeliharaan"] = editor)}
                initialContent={replacePlaceholders(templatePemeliharaan, dataTemplate)}
              />
            </div>
          )}

          {isApproved &&
            (submission?.guarantor?.name.toLowerCase().includes("jastan") ||
              submission?.guarantor?.name.toLowerCase().includes("jasa tania")) && (
              <div>
                <p className="text-xl font-semibold mb-4 mt-5">Jaminan Uang Muka Jastan</p>
                <TinyMCEEditor
                  id="uang-muka-jastan"
                  onInit={(evt, editor) => (editorRefs.current["uang-muka-jastan"] = editor)}
                  initialContent={replacePlaceholders(templateUangMuka, dataTemplate)}
                />
              </div>
            )}

        {isApproved && submission?.guarantor_to_product_type?.full_name.toLowerCase().includes("pelaksanaan") && (
            <div>
              <p className="text-xl font-semibold mb-4 mt-5">Jaminan Pelaksanaan</p>
              <TinyMCEEditor
                id="surat-pelaksanaan"
                onInit={(evt, editor) => (editorRefs.current["surat-pelaksanaan"] = editor)}
                initialContent={replacePlaceholders(templatePelaksanaan, dataTemplate)}
              />
            </div>
          )} */}
        </Show>
      </div>
    </main>
  );
};

export default SubmissionDetailPage;

SubmissionDetailPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <SubmissionDetailHeader title={"Detail Pengajuan"} />
      {page}
    </RoleBasedLayout>
  );
};
