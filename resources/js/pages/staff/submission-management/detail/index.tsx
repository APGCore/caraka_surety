import { AlertDialogDescription } from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Separator } from "@/_features/_common/components/_shadcn-ui/separator";
import { FileInput } from "@/_features/_common/components/file-input";
import { useCompareRatios } from "@/common/hooks/general/use-compare-ratios";
import useStepper from "@/common/hooks/general/use-stepper";
import { toast } from "@/common/hooks/general/use-toast";
import { cn } from "@/common/utils/cn";
import { formatCurrency } from "@/common/utils/format-currency";
import { Alert, AlertDescription, AlertTitle } from "@/components/_shadcn-ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/_shadcn-ui/alert-dialog";
import { Badge } from "@/components/_shadcn-ui/badge";
import { Button } from "@/components/_shadcn-ui/button";
import { Card, CardContent } from "@/components/_shadcn-ui/card";
import { Input } from "@/components/_shadcn-ui/input";
import Loading from "@/components/atoms/loading";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import TinyMCEEditor from "@/components/documents/tiny-mce-editor";
import { CalendarPicker } from "@/components/molecules/calendar/single-calendar";
import { PreviewFile } from "@/components/molecules/preview-file";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { SubmissionStatus } from "@/types/submission-status";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import { StringToBoolean } from "class-variance-authority/types";
import dayjs from "dayjs";
import { LoaderCircle } from "lucide-react";
import React, { Fragment, useEffect, useRef, useState } from "react";
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
    handleComparisonRatios(submission.principal?.ratios ?? []);
  }, []);

  const isProcess = submission.status === SubmissionStatus.PROCESS;
  const isApproved = submission.status === SubmissionStatus.APPROVED;
  const isRejected = submission.status === SubmissionStatus.REJECTED;
  const isRevised = submission.status === SubmissionStatus.REVISED;
  const [isLoading, setIsLoading] = useState(false);
  const colorAlert: StringToBoolean<any> = isProcess
    ? "warning"
    : isApproved
      ? "success"
      : isRejected
        ? "destructive"
        : "default";

  const { currentStep, steps, gotoStep } = useStepper(initialSteps);

  const { comparisonRatios, handleComparisonRatios } = useCompareRatios();

  const editorDocsRefs = useRef<{ [key: string]: any }>({});
  const editorRefs = useRef<{ [key: string]: any }>({});
  const [publicationDate, setPublicationDate] = useState<string | null>(submission.publication_date || null);
  const [publicationPlace, setPublicationPlace] = useState<string | null>(submission.publication_place || null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const submissionId = submission?.id || "";

  const documentFormat = () => {
    return Object.keys(editorRefs.current).map((key) => {
      const allDocuments = [...(Array.isArray(submission.document_formats) ? submission.document_formats : [])];

      const doc = allDocuments.find((d) => `editor-${d.id}` === key);

      return {
        id: doc ? doc.id : key,
        name: doc ? doc.name : key,
        content: editorRefs.current[key].getContent(),
      };
    });
  };

  const handleSendGuarantor = (submissionId: number) => {
    setIsLoading(true);

    const documents = documentFormat();
    axios
      .post(route("api.submission-management.document.store", { submissionId }), { documents })
      .then(() => axios.post(route("api.submission-management.send", { id: submissionId })))
      .then((response) => {
        console.log("Success Send To Guarantor", response);
        toast({
          title: "Sukses",
          description: "Pengajuan berhasil dikirim ke asuransi",
        });
        router.reload();
      })
      .catch((error) => {
        const message = error.response?.data?.message || error.message || "Terjadi kesalahan";
        console.error("Error Send To Guarantor", error);
        toast({
          title: "Gagal",
          description: message,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleUpdateDocument = (id: number, format: string) => {
    if (submission.has_send_to_guarantor) return;
    axios
      .put(route("api.submission-management.document", { id }), { format })
      .then((response) => {
        console.log("Success update document", response);
      })
      .catch((error) => {
        console.error("Error update document", error);
      });
  };

  const handleGetCallBackFromGuarantor = (submissionId: number) => {
    setIsLoading(true);
    axios
      .get(route("api.submission.post-to-get-callback", { submission_id: submissionId }))
      .then((response) => {
        console.log("Success Get Callback From Guarantor", response);
        router.reload();
      })
      .catch((error) => {
        console.error("Error Get Callback From Guarantor", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleEmbedQr = () => {
    setIsLoading(true);
    router.post(
      route("staff-submission-embedQr", { submission: submission.id }),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsLoading(false);
          toast({
            title: "Pembubuhan Berhasil",
            description: "Dokumen Berhasil Dibubuhkan QR Code",
            variant: "default",
          });
          window.location.reload();
        },
        onError: () => {
          setIsLoading(false);
          toast({
            title: "Gagal Pembubuhan Dokumen",
            description: "Dokumen gagal dibubuhkan QR Code",
            variant: "destructive",
          });
        },
      },
    );
  };

  const [spkmgrFile, setSpkmgrFile] = useState<File | null>(null);
  const [permohonanFile, setPermohonanFile] = useState<File | null>(null);

  const handleSubmitDoc = () => {
    setIsLoading(true);

    const formData = new FormData();
    if (spkmgrFile) formData.append("spkmgr_file", spkmgrFile);
    if (permohonanFile) formData.append("permohonan_file", permohonanFile);
    if (submission.id) formData.append("submission_id", String(submission.id));

    axios
      .post(route("staff-submission-save-permohonan-doc.submission"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      .then((response) => {
        console.log("Success submit submission", response);
        toast({
          title: "Dokumen berhasil diunggah!",
          description: "Dokumen berhasil diunggah.",
          variant: "default",
        });

        setSpkmgrFile(null);
        setPermohonanFile(null);

        router.reload();
      })
      .catch((error) => {
        console.error("Error submit submission", error.response?.data || error.message);

        const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat mengunggah dokumen.";
        toast({
          title: "Dokumen gagal diunggah!",
          description: errorMessage,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // const handleSubmitPublication = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   setIsPendingUpdatePublication(true);

  //   try {
  //     const payload = {
  //       submission_id: submissionId,
  //       publication_date: publicationDate,
  //       publication_place: publicationPlace,
  //     };

  //     const { data } = await axios.post(route("staff-submission-publication", { submission: submissionId }), payload);

  //     // Setelah selesai
  //   } catch (error) {
  //     console.error(error);
  //   } finally {
  //     setIsPendingUpdatePublication(false);
  //   }
  // };
  const handleSubmitPublication = async () => {
    setIsLoading(true);
    router.post(
      route("staff-submission-publication", { submission: submissionId }),
      {
        submission_id: submissionId,
        publication_date: publicationDate,
        publication_place: publicationPlace,
      },
      {
        onSuccess: () => {
          setIsLoading(false);
          toast({
            title: "Sukses",
            description: "Operasi berhasil dilakukan",
            variant: "default",
          });
        },
        onError: () => {
          setIsLoading(false);
          toast({
            title: "Gagal",
            description: "Terjadi kesalahan saat operasi",
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleDelete = (submission: any) => {
    setLoadingDelete(true);
    router.delete(route("staff-submission-destroy", { submission: submission.id }), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        location.reload();
      },
      onError: () => {
        // Handle error
      },
      onFinish: () => {
        setLoadingDelete(false);
      },
    });
  };

  useEffect(() => {
    if (!publicationDate) {
      setPublicationDate(dayjs().format("YYYY-MM-DD"));
    }
  }, [publicationDate]);

  console.log("submission", submission);

  return (
    <main className="space-y-10 w-[800px] mx-auto mt-[50px]">
      {/* STEPPER SECTION */}
      <div className="flex items-start">
        <RenderList
          of={steps as Array<any>}
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
          <Alert variant={colorAlert}>
            <AlertTitle>Status</AlertTitle>
            <AlertDescription>
              <Show when={isProcess}>
                <span>Pengajuan sedang diproses {submission.checked_at && "dan menunggu persetujuan"}</span>
              </Show>
              <Show when={isApproved}>
                <span>Pengajuan telah disetujui oleh {submission.user_approved?.name}</span>
              </Show>
              <Show when={isRejected}>
                <span>Pengajuan ditolak oleh {submission.user_rejected?.name}</span>
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
        </Show>
        <Show when={currentStep.name === "docs"}>
          <Show when={submission.required_docs && submission.required_docs.length > 0}>
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
                  of={submission.required_docs as Array<any>}
                  render={(doc) => {
                    return (
                      <tr key={doc.id} className="border-b">
                        <td className="p-2">{doc.name}</td>
                        <td className="p-2">{doc.description || "-"}</td>
                        <td className="p-2">
                          <Show when={!!doc?.url} fallback={"File Belum Diunggah"}>
                            <PreviewFile preview={doc.url} />
                          </Show>
                        </td>
                      </tr>
                    );
                  }}
                />
              </tbody>
            </table>
            <Show when={!(submission.required_docs && submission.required_docs.length > 0)}>
              <p className="text-gray-500">Tidak ada dokumen yang diunggah.</p>
            </Show>
          </Show>
        </Show>
        <Show when={currentStep.name === "contract"}>
          <table className="table-fixed w-full border border-gray-300">
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Blanko yang Digunakan</td>
                <td className="p-2 ">: {submission.blank?.number}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Produk</td>
                <td className="p-2 ">: {submission.guarantor_to_product_type?.name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Jenis Jaminan</td>
                <td className="p-2">: {submission.guarantor_to_product_type?.full_name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Nama Obligee</td>
                <td className="p-2">: {submission.obligee?.name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Alamat Obligee</td>
                <td className="p-2">: {submission.obligee?.address}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Nilai Kontrak</td>
                <td className="p-2">:{" " + submission.contract_value_formatted}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Nilai Jaminan</td>
                <td className="p-2">:{" " + submission.guarantee_value_formatted}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Jangka Waktu</td>
                <td className="p-2">
                  : {submission.time_period} hari <Badge>{submission.difference_time_period} Hari (Selisih)</Badge>
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Nama Pekerjaan</td>
                <td className="p-2">: {submission.job_name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Tanggal Terbit Jaminan</td>
                <td className="p-2">: {submission.guarantee_issue_date}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Lokasi Proyek</td>
                <td className="p-2">
                  : {submission.job_location_village}, {submission.district?.name}, {submission.regency?.name},{" "}
                  {submission.province?.name}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Sumber Dana</td>
                <td className="p-2">: {submission.source_of_fund?.name}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Kelompok Pekerjaan</td>
                <td className="p-2">: {submission.guarantor_to_product_type?.job_group}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold">Mulai Tanggal</td>
                <td className="p-2">: {submission.start_date}</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Selesai Tanggal</td>
                <td className="p-2">: {submission.end_date}</td>
              </tr>
              <tr>
                <td className="p-2" colSpan={2}>
                  <div className="flex flex-col items-center space-y-2">
                    <span className="font-semibold">Dokumen Kontrak</span>
                    <Separator />
                    <RenderList
                      of={submission.support_docs as Array<any>}
                      render={(doc) => (
                        <>
                          <div className="grid grid-cols-4 gap-4 mt-2 w-full">
                            <div className="col-span-1 text-center space-y-2.5">
                              <h3>Nama Dokumen</h3>
                              <p className="font-bold">{doc.name}</p>
                            </div>
                            <div className="col-span-1 text-center space-y-2.5">
                              <h3>Nomor Dokumen</h3>
                              <p className="font-bold">{doc.number}</p>
                            </div>
                            <div className="col-span-1 text-center space-y-2.5">
                              <h3>Tanggal Dokumen</h3>
                              <p className="font-bold">{doc.date}</p>
                            </div>
                            <div className="col-span-1 text-center space-y-1">
                              <h3>Dokumen</h3>
                              <PreviewFile preview={doc.url} />
                            </div>
                          </div>
                          <Separator />
                        </>
                      )}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Show>
        <Show when={currentStep.name === "skoring"}>
          {/*Rasio*/}
          <div>
            <h2 className="text-lg font-semibold mb-4 mt-10">Analisis Rasio Keuangan Perusahaan</h2>

            <table className="table-fixed border w-full border-gray-300">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="p-2 font-semibold text-left w-1">Rasio</th>
                  <RenderList
                    of={submission.principal?.ratios as Array<any>}
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
                    of={submission.principal?.ratios as Array<any>}
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
                    of={submission.principal?.ratios as Array<any>}
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
                    of={submission.principal?.ratios as Array<any>}
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
                    of={submission.principal?.ratios as Array<any>}
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
                    of={submission.principal?.ratios as Array<any>}
                    render={(ratio: any) => {
                      return <td className="p-2 font-semibold text-center w-1/2">{formatCurrency(ratio.revenue)}</td>;
                    }}
                  />
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-semibold text-left w-1/2">Laba Bersih</td>
                  <RenderList
                    of={submission.principal?.ratios as Array<any>}
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
                    <Show when={comparisonRatios.liquidity_ratios === true}>
                      <Badge variant="success" className="flex-shrink-0 h-6 mx-2">
                        Naik
                      </Badge>
                    </Show>
                    <Show when={comparisonRatios.liquidity_ratios === false}>
                      <Badge variant="destructive" className="flex-shrink-0 h-6 mx-2">
                        Turun
                      </Badge>
                    </Show>
                  </td>
                  <RenderList
                    of={submission.principal?.ratios as Array<any>}
                    render={(ratio: any) => {
                      return <td className="p-2 font-semibold text-center">{ratio.liquidity_ratios}</td>;
                    }}
                  />
                </tr>
                <tr className="border-b bg-gray-100">
                  <td className="p-2 font-semibold text-left">
                    Rasio Solvabilitas
                    <Show when={comparisonRatios.solvency_ratios === true}>
                      <Badge variant="success" className="flex-shrink-0 h-6 mx-2">
                        Naik
                      </Badge>
                    </Show>
                    <Show when={comparisonRatios.solvency_ratios === false}>
                      <Badge variant="destructive" className="flex-shrink-0 h-6 mx-2">
                        Turun
                      </Badge>
                    </Show>
                  </td>
                  <RenderList
                    of={submission.principal?.ratios as Array<any>}
                    render={(ratio: any) => {
                      return <td className="p-2 font-semibold text-center">{ratio.solvency_ratios}</td>;
                    }}
                  />
                </tr>
                <tr className="border-b bg-gray-100">
                  <td className="p-2 font-semibold text-left">
                    Rasio Profitabilitas
                    <Show when={comparisonRatios.profitability_ratios === true}>
                      <Badge variant="success" className="flex-shrink-0 h-6 mx-2">
                        Naik
                      </Badge>
                    </Show>
                    <Show when={comparisonRatios.profitability_ratios === false}>
                      <Badge variant="destructive" className="flex-shrink-0 h-6 mx-2">
                        Turun
                      </Badge>
                    </Show>
                  </td>
                  <RenderList
                    of={submission.principal?.ratios as Array<any>}
                    render={(ratio: any) => {
                      return <td className="p-2 font-semibold text-center">{ratio.profitability_ratios}%</td>;
                    }}
                  />
                </tr>
              </tbody>
            </table>
          </div>
          {/*Scoring*/}
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
                <RenderList
                  of={Object.entries(
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
                  )}
                  render={([id, scores]: [any, any]) => (
                    <React.Fragment key={id}>
                      <tr className="border-b bg-gray-100">
                        <td colSpan={4} className="p-2 font-bold">
                          {scores.name} ({scores.max_point})
                        </td>
                      </tr>
                      <RenderList
                        of={scores.items as Array<any>}
                        render={(score) => (
                          <tr key={score.id} className="border-b">
                            <td className="p-2 text-left"></td>
                            <td className="p-2 text-left">{score.question_name}</td>
                            <td className="p-2 text-left">{score.scoring_option.name}</td>
                            <td className="p-2 text-center">{score.point}</td>
                          </tr>
                        )}
                      />
                      <tr className="bg-gray-50">
                        <td className="p-2" colSpan={3}>
                          Sub Total:
                        </td>
                        <td className="p-2 text-center">
                          {scores.items.reduce((total: number, score: any) => total + score.point, 0)}
                        </td>
                      </tr>
                    </React.Fragment>
                  )}
                />
              </tbody>

              <tfoot>
                <tr className="border-b bg-gray-300">
                  <td className="p-2 font-semibold" colSpan={3}>
                    Total:
                  </td>
                  <td className="p-2 text-center">{submission.total_score}</td>
                </tr>
                <tr>
                  <td
                    colSpan={4}
                    className={cn({
                      "p-2 text-center": true,
                      "bg-green-300": submission.min_point_scoring <= submission.total_score,
                      "bg-red-300": submission.min_point_scoring > submission.total_score,
                    })}>
                    <span className="pr-1">Disarankan Untuk</span>
                    <Show when={submission.min_point_scoring <= submission.total_score}>
                      <span className="text-green-800">
                        Disetujui Karena Nilai {submission.total_score} Lebih Dari {submission.min_point_scoring}
                      </span>
                    </Show>
                    <Show when={submission.min_point_scoring > submission.total_score}>
                      <span className="text-red-800">
                        Ditolak Karena
                        {" Nilai " + submission.total_score + " Kurang Dari " + submission.min_point_scoring}
                      </span>
                    </Show>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4 mt-10">Catatan Skoring</h2>
            <p className="text-sm text-gray-600">{submission.note_scoring}</p>
          </div>
          {/* Mitigasi Risiko */}
          <Show when={submission.risk_mitigation}>
            <div>
              <h2 className="text-lg font-semibold mb-4 mt-10">Mitigasi Risiko</h2>
              <p className="text-sm text-gray-600">{submission.risk_mitigation}</p>
            </div>
          </Show>
          {/* Catatan */}
          <div>
            <h2 className="text-lg font-semibold mb-4 mt-10">Catatan</h2>
            <p className="text-sm text-gray-600">{submission.notes}</p>
          </div>
        </Show>
        <Show when={currentStep.name === "luaran"}>
          <Show when={submission.submission_docs.length > 0}>
            <RenderList
              of={submission.submission_docs as Array<any>}
              render={(doc) => {
                return (
                  <div>
                    <h2 className="text-lg font-semibold mb-4 mt-5">{doc.name}</h2>
                    <div>
                      <TinyMCEEditor
                        id={doc.name.replace(/\s+/g, "-").toLowerCase()}
                        onInit={(evt, editor) => (editorDocsRefs.current[`editor-${doc.id}`] = editor)}
                        initialContent={doc.format_document}
                        onContentChange={(content: string) => {
                          handleUpdateDocument(doc.id, content);
                        }}
                      />
                    </div>
                  </div>
                );
              }}
            />
          </Show>
          <Show when={submission.submission_docs.length === 0}>
            <RenderList
              of={submission.document_formats}
              render={(doc) => (
                <div key={doc.id} style={{ marginBottom: "20px" }}>
                  <h3 className="text-lg font-semibold mb-4 mt-5">{doc.name}</h3>
                  <TinyMCEEditor
                    id={doc.name.replace(/\s+/g, "-").toLowerCase()}
                    initialContent={doc.format_document}
                    onInit={(_, editor) => (editorRefs.current[`editor-${doc.id}`] = editor)}
                  />
                </div>
              )}
              renderFallback={() => <p className="text-gray-500">Tidak ada dokumen yang tersedia untuk ditampilkan.</p>}
            />
          </Show>
          <Separator className="my-5" />
          <Show when={submission.has_send_to_guarantor}>
            <div>
              <h2 className="text-lg font-semibold mb-4 mt-5">
                Dokumen Terverifikasi Dari {submission.guarantor?.name}
              </h2>
              <Card className="w-auto">
                <CardContent className="p-0">
                  <div className="flex flex-col items-center justify-center py-4">
                    {submission.callback ? (
                      <>
                        <img src={submission.callback.url} alt="Code QR" />
                        <Button onClick={() => window.open(submission.callback?.doc_url, "_blank")}>
                          Dokumen Pendukung
                        </Button>
                        <Button
                          className="mt-4"
                          onClick={handleEmbedQr}
                          disabled={isLoading || submission.is_added_qrcode === 1}>
                          {isLoading
                            ? "Memproses..."
                            : submission.is_added_qrcode === 1
                              ? "QR Code Sudah Dibubuhkan"
                              : "Bubuhkan QR Code"}
                        </Button>
                      </>
                    ) : (
                      <Button onClick={() => handleGetCallBackFromGuarantor(submission.id)}>
                        {isLoading && <LoaderCircle className="animate-spin mr-1" />}
                        Cek Respon Dari Asuransi
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </Show>
          {/*final output file*/}
          <Show when={!submission.has_send_to_guarantor && !submission.final_output_file.length && isApproved}>
            <p className="text-gray-500">Dokumen SPKMGR dan Suart Permohonan Belum ditandatangani</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitDoc();
              }}
              className="space-y-5 my-2">
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload File SPKMgr</h3>
                <FileInput onFileChange={(file) => setSpkmgrFile(file)} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Upload File Permohonan yang Ditandatangani</h3>
                <FileInput onFileChange={(file) => setPermohonanFile(file)} />
              </div>

              <div className="text-right">
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <LoaderCircle className="animate-spin mr-1" />}
                  {isLoading ? "Mengunggah..." : "Submit"}
                </Button>
              </div>
            </form>
          </Show>
          <Show when={submission.final_output_file.length && isApproved}>
            <h2 className="text-lg font-semibold mb-4 mt-5">Dokumen Final</h2>
            <div className="grid grid-cols-1 gap-4">
              {submission.final_output_file.map((file: any) => (
                <div key={file.id} className="flex items-center justify-between">
                  <p>{file.name}</p>
                  <PreviewFile preview={file.url} />
                </div>
              ))}
            </div>
          </Show>
          <hr />
          <Show when={isApproved && !submission.has_send_to_guarantor}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitPublication();
              }}>
              <div>
                <h3 className="text-lg font-semibold mb-2 pt-4">Tanggal Publikasi</h3>
                <CalendarPicker
                  dateFormat="YYYY-MM-DD"
                  initialDate={publicationDate ? dayjs(publicationDate).toDate() : dayjs().toDate()}
                  onPickDate={(e) => {
                    const selectedDate = dayjs(e);
                    const today = dayjs();
                    const minDate = today.subtract(1, "month");

                    if (selectedDate.isBefore(minDate) || selectedDate.isAfter(today)) {
                      toast({
                        title: "Gagal Memilih Tanggal",
                        description: "Tanggal publikasi harus dalam rentang 1 bulan terakhir hingga hari ini.",
                        variant: "destructive",
                      });
                      return;
                    }

                    setPublicationDate(selectedDate.format("YYYY-MM-DD"));
                  }}
                />
                <p className="text-sm text-gray-500 mt-1">* Tanggal publikasi hanya dapat diisi satu kali.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 mt-4">Tempat Publikasi</h3>
                <Input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2"
                  placeholder="Masukkan tempat publikasi"
                  value={publicationPlace || ""}
                  onChange={(e) => setPublicationPlace(e.target.value)}
                />
                <p className="text-sm text-gray-500 mt-1">* Tempat publikasi hanya dapat diisi satu kali.</p>
              </div>
              <div className="text-right mt-4">
                <Button disabled={isLoading} type="submit">
                  {isLoading && <LoaderCircle className="animate-spin mr-1" />}Simpan{" "}
                </Button>
              </div>
            </form>
            {/*buttons*/}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="default"
                  disabled={isLoading}
                  className="bg-green-600 text-destructive-foreground shadow-sm hover:bg-green-400 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                  {isLoading && <LoaderCircle className="animate-spin mr-1" />}
                  Kirim Ke {submission.guarantor?.name}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda Yakin ingin mengirimkan pengajuan ini?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-green-600 hover:bg-green-400"
                    onClick={() => handleSendGuarantor(submission.id)}>
                    Kirim
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </Show>
          <Show when={!submission.has_send_to_guarantor && !isRevised}>
            <div className="flex gap-4">
              <Show when={!isRejected}>
                <Button variant="outline" className="w-full bg-yellow-500 hover:bg-yellow-400 rounded-sm" asChild>
                  <Link type={"button"} href={route("staff-submission-edit", { id: submission.id })}>
                    Edit
                  </Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="bg-red-600 text-destructive-foreground shadow-sm hover:bg-red-400 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                      Batal
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Batalkan Pengajuan</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin membatalkan pengajuan ini? Pengajuan yang sudah dibatalkan tidak dapat
                        dikembalikan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="grid grid-cols-2 gap-4">
                      <AlertDialogCancel asChild>
                        <Button variant="outline" className="w-full" type="button">
                          Tidak
                        </Button>
                      </AlertDialogCancel>
                      <Button
                        variant="destructive"
                        className="w-full"
                        type="submit"
                        disabled={loadingDelete}
                        onClick={() => handleDelete(submission)}>
                        <Loading isLoading={loadingDelete} />
                        Batalkan Pengajuan
                      </Button>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </Show>
              <Show when={isApproved}>
                <Button variant={"outline"} className="w-full bg-yellow-500 hover:bg-yellow-400 rounded-sm" asChild>
                  <Link
                    type="button"
                    href={route("staff-submission-revision", {
                      id: submission.id,
                    })}>
                    Revisi
                  </Link>
                </Button>
              </Show>
            </div>
          </Show>
        </Show>
      </div>
    </main>
  );
};

export default SubmissionDetailPage;

SubmissionDetailPage.layout = (page: any) => {
  const pagePropsData = page.props;
  const isApproved = pagePropsData.submission.status == SubmissionStatus.APPROVED;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <SubmissionDetailHeader
        title={`Detail Pengajuan ${isApproved ? `(${pagePropsData.submission.no_guarantee})` : ""}`}
      />
      {page}
    </RoleBasedLayout>
  );
};
