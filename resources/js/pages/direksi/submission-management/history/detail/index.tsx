import { PreviewFile } from "@/components/common/preview-file";
import RenderList from "@/components/common/render-list";
import Show from "@/components/common/show";
import TinyMCEEditor from "@/components/documents/TinyMCEEditor";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCompareRatios } from "@/hooks/general/use-compare-ratios";
import useStepper from "@/hooks/general/use-stepper";
import DireksiLayoutPage from "@/layouts/direksi";
import { cn } from "@/lib/cn";
import { textCurrency } from "@/lib/text-currency";
import templateDraftSurety from "@/pages/output_templates/template-draft-surety";
import templateAnalyst from "@/pages/output_templates/template-hasil-analisa";
import templatePelaksanaan from "@/pages/output_templates/template-surat-pelaksanaan";
import templatePermohonan from "@/pages/output_templates/template-surat-permohonan-surety-bond-bumida";
import { SubmissionStatus } from "@/types/submission-status";
import { router } from "@inertiajs/react";
import axios from "axios";
import { AlertCircle, LoaderCircle } from "lucide-react";
import React, { Fragment, useEffect, useState } from "react";
import SubmissionDetailHeader from "./_partials/submission-detail-page-header";
import { SubmissionDetailPageProps } from "./submission-detail-page.type";

export type TFormDetailStep = "principal" | "docs" | "contract" | "skoring" | "luaran";
type TFormDetailStepperIndicator = {
  title: string;
  name: TFormDetailStep;
  isActive: boolean;
};

const initialSteps: Array<TFormDetailStepperIndicator> = [
  {
    title: "Profile",
    name: "principal",
    isActive: true,
  },
  {
    title: "Dokumen",
    name: "docs",
    isActive: false,
  },
  {
    title: "Kontrak",
    name: "contract",
    isActive: false,
  },
  {
    title: "Skoring",
    name: "skoring",
    isActive: false,
  },
  {
    title: "Luaran",
    name: "luaran",
    isActive: false,
  },
];

const SubmissionDetailPage: SubmissionDetailPageProps = ({ submission }) => {
  const { currentStep, steps, gotoStep } = useStepper(initialSteps);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    handleComparisonRatios(submission.principal?.ratios);
  }, []);

  const currentDate = new Date();
  const options = { year: "numeric" as const, month: "long" as const, day: "numeric" as const };
  const formattedDate = currentDate.toLocaleDateString("id-ID", options).toUpperCase();

  const formatCurrency = (value: number | string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(Number(value));
  };

  const replaceTemplatePlaceholders = (template: string, data: any) => {
    return template
      .replace("[NAMA_JAMINAN]", data.guarantee_type)
      .replace("[NAMA_PRINCIPAL]", data.principal.name)
      .replace("[TGL_PENGAJUAN]", formattedDate)
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
    created_date: submission.created_at,
  };

  const calculateTotalPoint = (scores: any) => {
    return scores.reduce((total: number, score: any) => total + score.point, 0);
  };

  const { comparisonRatios, handleComparisonRatios } = useCompareRatios();

  const handleApprove = (submissionId: number) => {
    setIsLoading(true);
    axios
      .post(route("manager-submission-approve", submissionId))
      .then((response) => {
        console.log("success approve submission", response);
        router.reload();
      })
      .catch((error) => {
        console.log("error approve submission", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleReject = (submissionId: number) => {
    setIsLoading(true);
    axios
      .post(route("manager-submission-reject", submissionId))
      .then((response) => {
        console.log("success reject submission", response);
        router.reload();
      })
      .catch((error) => {
        console.log("error reject submission", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Show when={submission.beyond_the_limit}>
        <div className="fixed top-20 w-[81%] z-[100]">
          <Alert variant="destructive" className="bg-red-100">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Peringatan</AlertTitle>
            <AlertDescription>
              Pengajuan Melebihi Batas Limit Pengajuan Rp. {textCurrency(submission.contract_value)}
            </AlertDescription>
          </Alert>
        </div>
      </Show>
      <main className={"space-y-10 w-[800px] mx-auto mt-[50px]"}>
        {/* STEPPER SECTION */}
        <div className="flex">
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
                      gotoStep(step.name);
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
                      className={cn("transition-all duration-300 text-gray-500", {
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
        <Show when={currentStep === "principal"}>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Detail Perusahaan</h1>
          </div>
          <div className="border rounded-sm p-4 space-y-6 bg-white">
            {/* STATUS */}
            <div>
              <h2>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    submission.status === SubmissionStatus.APPROVED
                      ? "bg-green-100 text-green-800"
                      : submission.status === SubmissionStatus.REJECTED
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  } uppercase`}>
                  {submission.status}
                </span>
              </h2>
            </div>
            <div>
              <table className="table-fixed w-full border border-gray-300">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-semibold w-1/2">Nama Perusahaan</td>
                    <td className="p-2">: {submission.principal?.name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold">Alamat Perusahaan</td>
                    <td className="p-2">: {submission.principal?.address}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold">NPWP</td>
                    <td className="p-2">: {submission.principal?.npwp}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold">No Telp Perusahaan</td>
                    <td className="p-2">: {submission.principal?.telephone}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold">NIB</td>
                    <td className="p-2">: {submission.principal?.nib}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold">SIUP / SIUJK</td>
                    <td className="p-2">: {submission.principal?.siup_siujk}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold">Nama Direksi</td>
                    <td className="p-2">: {submission.principal?.director_name}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold">Jabatan</td>
                    <td className="p-2">: {submission.principal?.director_position}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold">Nomor Handphone</td>
                    <td className="p-2">: {submission.principal?.director_phone}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-semibold">Komisaris</td>
                    <td className="p-2">: {submission.principal?.commissioner}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Show>

        <Show when={currentStep === "docs"}>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Detail Dokumen</h1>
          </div>
          <div className="border rounded-lg p-4 space-y-6 bg-white">
            <div>
              <h2>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    submission.status === SubmissionStatus.APPROVED
                      ? "bg-green-100 text-green-800"
                      : submission.status === SubmissionStatus.REJECTED
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  } uppercase`}>
                  {submission.status}
                </span>
              </h2>
            </div>
            {submission.required_docs && submission.required_docs.length > 0 ? (
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
                    of={submission.required_docs}
                    render={(doc) => {
                      return (
                        <tr key={doc.id} className="border-b">
                          <td className="p-2">{doc.name}</td>
                          <td className="p-2">{doc.description || "-"}</td>
                          <td className="p-2">
                            {doc?.url ? <PreviewFile preview={doc.url} /> : "File Belum Diunggah"}
                          </td>
                        </tr>
                      );
                    }}
                  />
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">Tidak ada dokumen yang diunggah.</p>
            )}
          </div>
        </Show>

        <Show when={currentStep === "contract"}>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Detail Kontrak</h1>
          </div>
          <div className="border rounded-lg p-4 space-y-6 bg-white">
            <div>
              <h2>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    submission.status === SubmissionStatus.APPROVED
                      ? "bg-green-100 text-green-800"
                      : submission.status === SubmissionStatus.REJECTED
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  } uppercase`}>
                  {submission.status}
                </span>
              </h2>
            </div>
            <table className="table-fixed w-full border border-gray-300">
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-semibold w-1/2">Produk</td>
                  <td className="p-2 ">: {submission.guarantor_to_product_type.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Jenis Jaminan</td>
                  <td className="p-2">: {submission.guarantor_to_product_type.full_name}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Nama Obligee</td>
                  <td className="p-2">: {submission.obligee.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Alamat Obligee</td>
                  <td className="p-2">: {submission.obligee.address}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Jenis Dokumen</td>
                  <td className="p-2">: {submission.contract_doc_name}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Nomor Dokumen</td>
                  <td className="p-2">: {submission.contract_doc_number}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Tanggal Dokumen</td>
                  <td className="p-2">
                    :{" "}
                    {new Date(submission.contract_doc_date).toLocaleDateString("id-ID", {
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
                    }).format(submission.contract_value)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Nilai Jaminan</td>
                  <td className="p-2">
                    :{" "}
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    }).format(submission.guarantee_value)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Jangka Waktu</td>
                  <td className="p-2">: {submission.time_period} hari</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Nama Pekerjaan</td>
                  <td className="p-2">: {submission.job_name}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Tanggal Terbit Jaminan</td>
                  <td className="p-2">
                    :{" "}
                    {submission?.guarantee_issue_date &&
                      new Date(submission.guarantee_issue_date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Lokasi Proyek</td>
                  <td className="p-2">: {submission.job_location}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Sumber Dana</td>
                  <td className="p-2">: {submission.source_of_fund.name}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Kelompok Pekerjaan</td>
                  <td className="p-2">: {submission.guarantor_to_product_type.job_group}</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold">Mulai Tanggal</td>
                  <td className="p-2">
                    :{" "}
                    {new Date(submission.start_date).toLocaleDateString("id-ID", {
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
        </Show>

        <Show when={currentStep === "skoring"}>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Detail Skoring</h1>
          </div>
          <div className="border rounded-lg p-4 space-y-6 bg-white">
            <div>
              <h2>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    submission.status === SubmissionStatus.APPROVED
                      ? "bg-green-100 text-green-800"
                      : submission.status === SubmissionStatus.REJECTED
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  } uppercase`}>
                  {submission.status}
                </span>
              </h2>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4 mt-10">Analisis Rasio Keuangan Perusahaan</h2>
              <div className="flex justify-between w-full">
                <div className="w-full">
                  <table className="table-fixed border w-full border-gray-300">
                    <thead>
                      <tr className="border-b bg-gray-100">
                        <th className="p-2 font-semibold text-left w-1/2">Rasio</th>
                        <RenderList
                          of={submission.principal?.ratios}
                          render={(ratio: any) => {
                            return <th className="p-2 font-semibold text-center w-1/2">{ratio.year}</th>;
                          }}
                        />
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-2 font-semibold text-left w-1/2">Aktiva Lancar</td>
                        <RenderList
                          of={submission.principal?.ratios}
                          render={(ratio: any) => {
                            return <td className="p-2 font-semibold text-center w-1/2">{ratio.current_assets}</td>;
                          }}
                        />
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-semibold text-left w-1/2">Utang Lancar</td>
                        <RenderList
                          of={submission.principal?.ratios}
                          render={(ratio: any) => {
                            return <td className="p-2 font-semibold text-center w-1/2">{ratio.current_debt}</td>;
                          }}
                        />
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-semibold text-left w-1/2">Total Utang</td>
                        <RenderList
                          of={submission.principal?.ratios}
                          render={(ratio: any) => {
                            return <td className="p-2 font-semibold text-center w-1/2">{ratio.total_debt}</td>;
                          }}
                        />
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-semibold text-left w-1/2">Total Aktiva</td>
                        <RenderList
                          of={submission.principal?.ratios}
                          render={(ratio: any) => {
                            return <td className="p-2 font-semibold text-center w-1/2">{ratio.total_assets}</td>;
                          }}
                        />
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-semibold text-left w-1/2">Pendapatan</td>
                        <RenderList
                          of={submission.principal?.ratios}
                          render={(ratio: any) => {
                            return <td className="p-2 font-semibold text-center w-1/2">{ratio.revenue}</td>;
                          }}
                        />
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-semibold text-left w-1/2">Laba Bersih</td>
                        <RenderList
                          of={submission.principal?.ratios}
                          render={(ratio: any) => {
                            return <td className="p-2 font-semibold text-center w-1/2">{ratio.net_income}</td>;
                          }}
                        />
                      </tr>
                    </tbody>
                  </table>
                </div>

                <table className="table-fixed w-full border border-gray-300">
                  <thead>
                    <tr className="border-b bg-gray-100">
                      <th className="p-2 font-semibold text-left w-[200px]">Rasio</th>
                      <RenderList
                        of={submission.principal?.ratios}
                        render={(ratio: any) => {
                          return <th className="p-2 font-semibold text-center w-1/5">{ratio.year}</th>;
                        }}
                      />
                    </tr>
                  </thead>
                  <tbody>
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
                        of={submission.principal?.ratios}
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
                        of={submission.principal?.ratios}
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
                        of={submission.principal?.ratios}
                        render={(ratio: any) => {
                          return <td className="p-2 font-semibold text-center">{ratio.solvency_ratios}</td>;
                        }}
                      />
                    </tr>
                  </tbody>
                </table>
              </div>
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
                    submission.scores.reduce((grouped: any, score: any) => {
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
                            <td className="p-2 text-left">{score.option_name}</td>
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
                    <td className="p-2 text-center">{calculateTotalPoint(submission.scores)}</td>
                  </tr>
                  <tr>
                    <td
                      colSpan={4}
                      className={cn({
                        "p-2 text-center": true,
                        "bg-green-300":
                          submission.scores?.[0].scoring.min_point < calculateTotalPoint(submission.scores),
                        "bg-red-300":
                          submission.scores?.[0].scoring.min_point >= calculateTotalPoint(submission.scores),
                      })}>
                      <span className="pr-1">Disarankan Untuk</span>
                      {submission.scores?.[0].scoring.min_point < calculateTotalPoint(submission.scores) ? (
                        <span className="text-green-800">
                          Disetujui Karena Nilai {calculateTotalPoint(submission.scores)} Lebih Dari{" "}
                          {submission.scores?.[0].scoring.min_point}
                        </span>
                      ) : (
                        <span className="text-red-800">
                          Ditolak Karena
                          {" Nilai " +
                            calculateTotalPoint(submission.scores) +
                            " Kurang Dari " +
                            submission.scores?.[0].scoring.min_point}
                        </span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Show>

        <Show when={currentStep === "luaran"}>
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Detail Luaran</h1>
          </div>
          <div className="border rounded-lg p-4  bg-white">
            <div>
              <h2>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    submission.status === SubmissionStatus.APPROVED
                      ? "bg-green-100 text-green-800"
                      : submission.status === SubmissionStatus.REJECTED
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                  } uppercase`}>
                  {submission.status}
                </span>
              </h2>
            </div>
            <div>
              <div className="pt-6">
                <h2 className="text-lg font-semibold mb-4 mt-5">Surat Hasil Analisis</h2>
                <div>
                  <TinyMCEEditor
                    id="hasil-analisis"
                    initialContent={replaceTemplatePlaceholders(templateAnalyst, data)}
                  />
                </div>
              </div>
              <div className="pt-6">
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
              </div>
            </div>
          </div>
        </Show>
        <Show
          when={
            submission.status === SubmissionStatus.PROCESS &&
            !submission.beyond_the_limit &&
            !submission.approved_at &&
            !submission.rejected_at
          }>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="default"
                  disabled={isLoading}
                  className="bg-red-600 text-destructive-foreground shadow-sm hover:bg-red-400 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                  {isLoading && <LoaderCircle className="animate-spin mr-1" />}
                  Reject
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda Yakin ingin menolak pengajuan ini?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-400"
                    onClick={() => submission.id && handleReject(submission.id)}>
                    Tolak
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="default"
                  disabled={isLoading}
                  className="bg-green-600 text-destructive-foreground shadow-sm hover:bg-green-400 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                  {isLoading && <LoaderCircle className="animate-spin mr-1" />}
                  Approve
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda Yakin ingin menyetujui pengajuan ini?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-green-600 hover:bg-green-400"
                    onClick={() => submission.id && handleApprove(submission.id)}>
                    Setujui
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Show>
      </main>
    </>
  );
};

export default SubmissionDetailPage;

SubmissionDetailPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <DireksiLayoutPage user={pagePropsData?.auth?.user}>
      <div
        className={cn({
          "mt-[7%]": pagePropsData?.submission?.beyond_the_limit,
        })}>
        <SubmissionDetailHeader title={"Detail Pengajuan"} />
        {page}
      </div>
    </DireksiLayoutPage>
  );
};
