import { AlertDialogDescription } from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { CardFooter, CardHeader, CardTitle } from "@/_features/_common/components/_shadcn-ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/_features/_common/components/_shadcn-ui/popover";
import { Separator } from "@/_features/_common/components/_shadcn-ui/separator";
import { Skeleton } from "@/_features/_common/components/_shadcn-ui/skeleton";
import { FileInput } from "@/_features/_common/components/file-input";
import { useGetAllBlank } from "@/_features/blank/services/blank-query";
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
import { Combobox } from "@/components/molecules/combobox";
import { PreviewFile } from "@/components/molecules/preview-file";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { SubmissionStatus } from "@/types/submission-status";
import { Link, router } from "@inertiajs/react";
import axios from "axios";
import { StringToBoolean } from "class-variance-authority/types";
import dayjs from "dayjs";
import { EllipsisVertical, LoaderCircle } from "lucide-react";
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
  const isWeekend = dayjs().day() === 0 || dayjs().day() === 6;
  const submissionId = submission?.id || "";
  const isProcess = submission.status === SubmissionStatus.PROCESS;
  const isApproved = submission.status === SubmissionStatus.APPROVED;
  const isRejected = submission.status === SubmissionStatus.REJECTED;
  const isRevised = submission.status === SubmissionStatus.REVISED;
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [isLoadingPublication, setIsLoadingPublication] = useState(false);
  const [isLoadingEmbedQr, setIsLoadingEmbedQr] = useState(false);
  const [isLoadingGetCallback, setIsLoadingGetCallback] = useState(false);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [isLoadingSend, setIsLoadingSend] = useState(false);
  const [isLoadingSetBlank, setIsLoadingSetBlank] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingSpecimen, setIsLoadingSpecimen] = useState(false);
  const [isLoadingSaveDoc, setIsLoadingSaveDoc] = useState(false);
  const [isLoadingResetDoc, setIsLoadingResetDoc] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [specimenCacheBuster, setSpecimenCacheBuster] = useState(Date.now());
  const [selectedBlank, setSelectedBlank] = useState(submission.blank_id);
  const colorAlert: StringToBoolean<any> = isProcess
    ? "warning"
    : isApproved
      ? "success"
      : isRejected
        ? "destructive"
        : "default";

  const { currentStep, steps, gotoStep } = useStepper(initialSteps);
  const editorRefs = useRef<{ [key: string]: any }>({});
  const { comparisonRatios, handleComparisonRatios } = useCompareRatios();
  const [publicationDate, setPublicationDate] = useState<string | null>(submission.publication_date || null);
  const [publicationPlace, setPublicationPlace] = useState<string | null>(submission.publication_place || null);
  const [spkmgrFile, setSpkmgrFile] = useState<File | null>(null);
  const [permohonanFile, setPermohonanFile] = useState<File | null>(null);
  const { data: blanks } = useGetAllBlank(submission.guarantor_branch_id, submission.blank_id);

  // Get documents with no=4 (specimen documents) for selection
  const specimenDocuments = (submission.document_formats || []).filter((doc: any) => doc.no === 4);
  const hasMultipleSpecimenDocs = specimenDocuments.length > 1;
  const [selectedSpecimenDocId, setSelectedSpecimenDocId] = useState<number | null>(
    specimenDocuments.length > 0 ? specimenDocuments[0]?.id : null,
  );

  // Filter document_formats to show only selected specimen doc when there are multiples
  const filteredDocumentFormats = React.useMemo(() => {
    if (!hasMultipleSpecimenDocs) {
      return submission.document_formats;
    }
    // Filter out all specimen docs except the selected one
    return (submission.document_formats || []).filter((doc: any) => doc.no !== 4 || doc.id === selectedSpecimenDocId);
  }, [submission.document_formats, selectedSpecimenDocId, hasMultipleSpecimenDocs]);

  const setLoadingDocument = () => {
    setIsLoadingDocument(true);
    setTimeout(() => {
      setIsLoadingDocument(false);
    }, 1000);
  };

  // const handleSetBlank = () => {
  //   if (!selectedBlank) {
  //     toast({
  //       title: "Gagal",
  //       description: "Silakan pilih blangko terlebih dahulu.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
  //   setIsLoadingSetBlank(true);
  //   setIsDisabled(true);
  //   axios
  //     .post(route("api.submission-management.set-blank"), {
  //       submission_id: submissionId,
  //       blank_id: selectedBlank,
  //     })
  //     .then((response) => {
  //       console.log("Success Set Blangko", response);
  //       toast({
  //         title: "Sukses",
  //         description: "Blangko berhasil dipilih.",
  //         variant: "default",
  //       });
  //       router.reload({
  //         onSuccess: () => {
  //           setLoadingDocument();
  //         },
  //         onFinish: () => {
  //           setIsLoadingSetBlank(false);
  //           setIsDisabled(false);
  //         },
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error Set Blangko", error);
  //       setIsLoadingSetBlank(false);
  //       setIsDisabled(false);
  //     });
  // };

  const handleSendGuarantor = (submissionId: number) => {
    let failed = false;
    const message = [];
    if (!publicationPlace) {
      failed = true;
      message.push("Tempat publikasi tidak boleh kosong");
    }
    if (!publicationDate) {
      failed = true;
      message.push("Tanggal publikasi tidak boleh kosong");
    }
    // if (!submission.blank_id) {
    //   failed = true;
    //   message.push("Silakan Isi Blangko terlebih dahulu");
    // }
    if (failed) {
      toast({
        title: "Gagal",
        description: message.join(", ") + ".",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingSend(true);
    setIsDisabled(true);

    axios
      .post(route("api.submission-management.send", { id: submissionId }))
      .then((response) => {
        console.log("Success Send To Guarantor", response);
        toast({
          title: "Sukses",
          description: "Pengajuan berhasil dikirim ke asuransi",
        });
        router.reload({
          onFinish: () => {
            setIsLoadingSend(false);
            setIsDisabled(false);
          },
        });
      })
      .catch((error) => {
        const message = error.response?.data?.error?.message || error.message || "Terjadi kesalahan";
        console.error("Error Send To Guarantor", error);
        toast({
          title: "Gagal",
          description: message,
          variant: "destructive",
        });
        setIsLoadingSend(false);
        setIsDisabled(false);
      });
  };

  // const handleUpdateDocument = (id: number, format: string) => {
  //   axios
  //     .put(route("api.submission-management.document.update", { id }), { format })
  //     .then((response) => {
  //       console.log("Success update document", response);
  //     })
  //     .catch((error) => {
  //       console.error("Error update document", error);
  //     });
  // };

  const handleGetCallBackFromGuarantor = (submissionId: number) => {
    setIsLoadingGetCallback(true);
    setIsDisabled(true);
    axios
      .get(route("api.submission-management.post-to-get-callback", { submission_id: submissionId }))
      .then((response) => {
        console.log("Success Get Callback From Guarantor", response);
        toast({
          title: "Sukses",
          description: "Berhasil mendapatkan callback dari asuransi.",
          variant: "default",
        });
        router.reload({
          onFinish: () => {
            setIsLoadingGetCallback(false);
            setIsDisabled(false);
          },
        });
      })
      .catch((error) => {
        console.error("Error Get Callback From Guarantor", error);
        const message =
          error.response?.data?.message || error.message || "Terjadi kesalahan saat mendapatkan callback.";
        toast({
          title: "Gagal",
          description: message,
          variant: "destructive",
        });
        setIsLoadingGetCallback(false);
        setIsDisabled(false);
      });
  };

  const handleEmbedQr = () => {
    setIsLoadingEmbedQr(true);
    setIsDisabled(true);
    router.post(
      route("staff-submission-embedQr", { submission: submission.id }),
      {},
      {
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Pembubuhan Berhasil",
            description: "Dokumen Berhasil Dibubuhkan QR Code",
            variant: "default",
          });
        },
        onError: () => {
          toast({
            title: "Gagal Pembubuhan Dokumen",
            description: "Dokumen gagal dibubuhkan QR Code",
            variant: "destructive",
          });
        },
        onFinish: () => {
          setIsLoadingEmbedQr(false);
          setIsDisabled(false);
          setLoadingDocument();
        },
      },
    );
  };

  const handleSubmitDoc = () => {
    setIsLoadingUpload(true);
    setIsDisabled(true);

    const formData = new FormData();
    if (spkmgrFile) formData.append("spkmgr_file", spkmgrFile);
    if (permohonanFile) formData.append("permohonan_file", permohonanFile);
    if (submission.id) formData.append("submission_id", String(submission.id));

    axios
      .post(route("api.submission-management.save-permohonan-doc"), formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log("Success submit submission", response);
        toast({
          title: "Dokumen berhasil di upload!",
          description: "Dokumen berhasil di upload.",
          variant: "default",
        });

        setSpkmgrFile(null);
        setPermohonanFile(null);

        router.reload({
          onFinish: () => {
            setIsLoadingUpload(false);
            setIsDisabled(false);
          },
        });
      })
      .catch((error) => {
        console.error("Error submit submission", error.response?.data || error.message);

        const errorMessage = error.response?.data?.message || "Terjadi kesalahan saat upload dokumen.";
        toast({
          title: "Dokumen gagal di upload!",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoadingUpload(false);
        setIsDisabled(false);
      });
  };

  const handleSubmitPublication = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoadingPublication(true);
    setIsDisabled(true);
    router.post(
      route("staff-submission-publication"),
      {
        submission_id: submissionId,
        publication_date: publicationDate,
        publication_place: publicationPlace,
      },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          toast({
            title: "Sukses",
            description: "Operasi berhasil dilakukan",
            variant: "default",
          });
        },
        onError: () => {
          toast({
            title: "Gagal",
            description: "Terjadi kesalahan saat operasi",
            variant: "destructive",
          });
        },
        onFinish: () => {
          setIsLoadingPublication(false);
          setIsDisabled(false);
          setLoadingDocument();
        },
      },
    );
  };

  const handleDelete = (submission: any) => {
    setIsLoadingDelete(true);
    setIsDisabled(true);
    router.delete(route("staff-submission-destroy", { submission: submission.id }), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        toast({
          title: "Sukses",
          description: "Pengajuan berhasil dihapus.",
          variant: "default",
        });
        router.visit(route("staff-submission-history"));
      },
      onFinish: () => {
        setIsLoadingDelete(false);
        setIsDisabled(false);
      },
    });
  };

  const handleGenerateSpecimen = () => {
    // Find document format with no=4 based on selected specimen doc id
    const specimenDoc = hasMultipleSpecimenDocs
      ? specimenDocuments.find((doc: any) => doc.id === selectedSpecimenDocId)
      : submission.document_formats?.find((doc: any) => doc.no === 4);
    console.log(specimenDoc);

    if (!specimenDoc) {
      toast({
        title: "Gagal",
        description: "Dokumen specimen tidak ditemukan.",
        variant: "destructive",
      });
      return;
    }

    // Get content from editor if available, otherwise use original format_document
    const editorContent = editorRefs.current[`editor-${specimenDoc.id}`]?.getContent();
    const content = editorContent || specimenDoc.format_document;

    setIsLoadingSpecimen(true);
    setIsDisabled(true);
    axios
      .post(route("api.submission-management.specimen.download"), {
        content: content,
        submission_id: submissionId,
        document_format_id: specimenDoc.id,
      })
      .then((response) => {
        console.log("Success Generate Specimen", response);
        toast({
          title: "Sukses",
          description: "Specimen PDF berhasil di-generate.",
          variant: "default",
        });
        router.reload({
          onSuccess: () => {
            setSpecimenCacheBuster(Date.now());
          },
          onFinish: () => {
            setIsLoadingSpecimen(false);
            setIsDisabled(false);
          },
        });
      })
      .catch((error) => {
        console.error("Error Generate Specimen", error);
        const message = error.response?.data?.message || error.message || "Terjadi kesalahan saat generate specimen.";
        toast({
          title: "Gagal",
          description: message,
          variant: "destructive",
        });
        setIsLoadingSpecimen(false);
        setIsDisabled(false);
      });
  };

  const handleDownloadSpecimen = () => {
    window.open(route("api.submission-management.specimen.get", { submissionId: submissionId }), "_blank");
  };

  // const handleSaveDocument = (docId: number) => {
  //   const editorContent = editorRefs.current[`editor-${docId}`]?.getContent();

  //   if (!editorContent) {
  //     toast({
  //       title: "Gagal",
  //       description: "Konten dokumen tidak ditemukan.",
  //       variant: "destructive",
  //     });
  //     return;
  //   }

  //   setIsLoadingSaveDoc(true);
  //   setIsDisabled(true);
  //   axios
  //     .post(route("api.submission-management.specimen.download"), {
  //       content: editorContent,
  //       submission_id: submissionId,
  //       document_format_id: docId,
  //     })
  //     .then((response) => {
  //       console.log("Success Save Document", response);
  //       toast({
  //         title: "Sukses",
  //         description: "Dokumen berhasil disimpan dan specimen PDF berhasil di-generate.",
  //         variant: "default",
  //       });
  //       router.reload({
  //         onSuccess: () => {
  //           setSpecimenCacheBuster(Date.now());
  //         },
  //         onFinish: () => {
  //           setIsLoadingSaveDoc(false);
  //           setIsDisabled(false);
  //         },
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error Save Document", error);
  //       const message = error.response?.data?.message || error.message || "Terjadi kesalahan saat menyimpan dokumen.";
  //       toast({
  //         title: "Gagal",
  //         description: message,
  //         variant: "destructive",
  //       });
  //       setIsLoadingSaveDoc(false);
  //       setIsDisabled(false);
  //     });
  // };

  // const handleResetDocument = (docId: number) => {
  //   setIsLoadingResetDoc(true);
  //   setIsDisabled(true);
  //   axios
  //     .post(route("api.submission-management.specimen.reset"), {
  //       submission_id: submissionId,
  //       document_format_id: docId,
  //     })
  //     .then((response) => {
  //       console.log("Success Reset Document", response);
  //       toast({
  //         title: "Sukses",
  //         description: "Dokumen berhasil direset ke default.",
  //         variant: "default",
  //       });
  //       router.reload({
  //         onSuccess: () => {
  //           setSpecimenCacheBuster(Date.now());
  //         },
  //         onFinish: () => {
  //           setIsLoadingResetDoc(false);
  //           setIsDisabled(false);
  //         },
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error Reset Document", error);
  //       const message = error.response?.data?.message || error.message || "Terjadi kesalahan saat mereset dokumen.";
  //       toast({
  //         title: "Gagal",
  //         description: message,
  //         variant: "destructive",
  //       });
  //       setIsLoadingResetDoc(false);
  //       setIsDisabled(false);
  //     });
  // };

  useEffect(() => {
    handleComparisonRatios(submission.principal?.ratios ?? []);
  }, []);

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
                <td className="p-2 font-semibold w-1/2">Cabang Asuransi</td>
                <td className="p-2 ">: {submission.guarantor_branch?.name ?? "-"}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-semibold w-1/2">Blanko yang Digunakan</td>
                <td className="p-2 ">: {submission.blank?.number ?? "X".repeat(10)}</td>
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
                <td className="p-2">: {submission.guarantee_issue_date ?? "-"}</td>
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
                            <Show when={doc.url}>
                              <div className="col-span-1 text-center space-y-1">
                                <h3>File</h3>
                                <PreviewFile preview={doc.url} />
                              </div>
                            </Show>
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
          {/*agar elemen hilang dulu*/}
          {isLoadingDocument ? (
            <RenderList
              of={[1, 2, 3]}
              render={() => (
                <div className="flex flex-col space-y-3">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-[766px] w-full rounded-xl" />
                </div>
              )}
            />
          ) : (
            <div className="space-y-6">
              <span>Luaran Dokumen</span>
              {/* Pilih Dokumen Specimen jika ada lebih dari satu */}
              <Show when={!submission.has_send_to_guarantor && hasMultipleSpecimenDocs}>
                <Card className="mb-4 border-amber-200 bg-amber-50">
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg font-semibold">Pilih Dokumen Jaminan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Terdapat <strong>{specimenDocuments.length} dokumen jaminan</strong> yang tersedia dengan format
                      yang sama. Pilih salah satu dokumen yang sesuai untuk pengajuan ini.
                    </p>
                    <div className="flex flex-col gap-4">
                      <Combobox
                        datas={specimenDocuments}
                        labelKey="name"
                        valueKey="name"
                        placeholder="Pilih Dokumen Jaminan"
                        defaultValueId={selectedSpecimenDocId}
                        onSelect={(val: any) => {
                          setSelectedSpecimenDocId(val?.id);
                          setLoadingDocument();
                        }}
                      />
                    </div>
                    <p className="text-xs text-amber-700 mt-3">
                      * Jika mengubah pilihan dokumen, pastikan untuk generate ulang specimen PDF di bawah.
                    </p>
                  </CardContent>
                </Card>
              </Show>
              {/*<RenderList*/}
              {/*  of={submission.has_send_to_guarantor ? submission.submission_docs : submission.document_formats}*/}
              {/*  render={(doc) => {*/}
              {/*    const [loading, setLoading] = React.useState(true);*/}
              {/*    const params = new URLSearchParams({*/}
              {/*      submission_id: String(submission.id),*/}
              {/*    });*/}
              {/*    if (submission.has_send_to_guarantor) {*/}
              {/*      params.append("submission_doc_id", String(doc.id));*/}
              {/*    } else {*/}
              {/*      params.append("document_format_id", String(doc.id));*/}
              {/*    }*/}
              {/*    return (*/}
              {/*      <div key={doc.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">*/}
              {/*        <div className="flex items-center justify-between mb-2">*/}
              {/*          <div>*/}
              {/*            <p className="font-medium">{doc.name}</p>*/}
              {/*          </div>*/}
              {/*          <div className="flex items-center gap-2">*/}
              {/*            <a*/}
              {/*              href={route("report.export.submission.pdf.preview", params.toString())}*/}
              {/*              target="_blank"*/}
              {/*              rel="noopener noreferrer">*/}
              {/*              <Button variant="outline" size="sm" className="flex items-center gap-2">*/}
              {/*                Lihat PDF*/}
              {/*              </Button>*/}
              {/*            </a>*/}
              {/*            <a*/}
              {/*              href={route("report.export.submission.word.preview", params.toString())}*/}
              {/*              target="_blank"*/}
              {/*              rel="noopener noreferrer">*/}
              {/*              <Button variant="outline" size="sm" className="flex items-center gap-2">*/}
              {/*                Export Word*/}
              {/*              </Button>*/}
              {/*            </a>*/}
              {/*          </div>*/}
              {/*        </div>*/}

              {/*        <div className="relative w-full h-[300px] border rounded">*/}
              {/*          {loading && (*/}
              {/*            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 z-10">*/}
              {/*              <LoaderCircle className="w-6 h-6 animate-spin text-gray-500" />*/}
              {/*              <p className="mt-2 text-sm text-muted-foreground">Memuat PDF...</p>*/}
              {/*            </div>*/}
              {/*          )}*/}
              {/*          <iframe*/}
              {/*            src={route("report.export.submission.pdf.preview", params.toString())}*/}
              {/*            className="w-full h-full rounded"*/}
              {/*            onLoad={() => setLoading(false)}*/}
              {/*          />*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*    );*/}
              {/*  }}*/}
              {/*  renderFallback={() => (*/}
              {/*    <p className="text-gray-500">Tidak ada dokumen yang tersedia untuk ditampilkan.</p>*/}
              {/*  )}*/}
              {/*/>*/}
              <RenderList
                of={submission.has_send_to_guarantor ? submission.submission_docs : filteredDocumentFormats}
                render={(doc) => (
                  <div
                    key={doc.no === 4 ? `${doc.id}-${specimenCacheBuster}` : doc.id}
                    style={{ marginBottom: "20px" }}>
                    <h3 className="text-lg font-semibold mb-4 mt-5">{doc.name}</h3>
                    <TinyMCEEditor
                      id={doc.name.replace(/\s+/g, "-").toLowerCase()}
                      initialContent={doc.format_document}
                      onInit={(_, editor) => (editorRefs.current[`editor-${doc.id}`] = editor)}
                    />
                    <Show when={doc.no === 4 && !submission.has_send_to_guarantor}>
                      <div className="flex justify-end gap-2 mt-4">
                        {/* <Button
                          onClick={() => handleResetDocument(doc.id)}
                          disabled={isLoadingResetDoc || isDisabled}
                          variant="outline">
                          {isLoadingResetDoc && <LoaderCircle className="animate-spin mr-1" />}
                          Reset ke Default
                        </Button>
                        <Button
                          onClick={() => handleSaveDocument(doc.id)}
                          disabled={isLoadingSaveDoc || isDisabled}
                          variant="default">
                          {isLoadingSaveDoc && <LoaderCircle className="animate-spin mr-1" />}
                          Simpan Perubahan
                        </Button> */}
                      </div>
                    </Show>
                  </div>
                )}
                renderFallback={() => (
                  <p className="text-gray-500">Tidak ada dokumen yang tersedia untuk ditampilkan.</p>
                )}
              />
            </div>
          )}
          {/*Specimen PDF*/}
          <Show when={!submission.has_send_to_guarantor}>
            <Card className="mb-4">
              <CardHeader className="p-4">
                <CardTitle className="text-lg font-semibold">Specimen PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Generate specimen PDF untuk preview dokumen sebelum dikirim ke asuransi.
                </p>
                <Show when={hasMultipleSpecimenDocs}>
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Dokumen Terpilih:</strong>{" "}
                      {specimenDocuments.find((doc: any) => doc.id === selectedSpecimenDocId)?.name || "-"}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      * Pastikan untuk generate ulang specimen jika mengubah pilihan dokumen.
                    </p>
                  </div>
                </Show>
                <div className="flex space-x-2 mb-4">
                  <Button onClick={handleGenerateSpecimen} disabled={isLoadingSpecimen || isDisabled} variant="outline">
                    {isLoadingSpecimen && <LoaderCircle className="animate-spin mr-1" />}
                    {submission.specimen_pdf_path ? "Update Specimen" : "Generate Specimen"}
                  </Button>
                  <Show when={submission.specimen_pdf_path}>
                    <Button onClick={handleDownloadSpecimen} disabled={isDisabled}>
                      Download Specimen
                    </Button>
                  </Show>
                </div>
                {/* PDF Preview */}
                <Show when={submission.specimen_pdf_path}>
                  <div className="border rounded-lg overflow-hidden">
                    <iframe
                      key={specimenCacheBuster}
                      src={`${route("api.submission-management.specimen.preview", { submissionId: submissionId })}?t=${specimenCacheBuster}`}
                      className="w-full h-[600px]"
                      title="Specimen PDF Preview"
                    />
                  </div>
                </Show>
              </CardContent>
            </Card>
          </Show>
          {/*Publikasi*/}
          <Show when={isApproved && (!submission.has_send_to_guarantor || !submission.publication_date)}>
            <form onSubmit={handleSubmitPublication}>
              <Card className="mb-4">
                <CardContent>
                  <div className="flex space-x-4">
                    <div className="w-full">
                      <h3 className="text-lg font-semibold mb-2 pt-4">Tanggal Publikasi</h3>
                      <CalendarPicker
                        className="w-full border border-gray-300 rounded-lg p-2"
                        dateFormat="YYYY-MM-DD"
                        initialDate={publicationDate ? dayjs(publicationDate).toDate() : dayjs().toDate()}
                        onPickDate={(e) => {
                          const selectedDate = dayjs(e);
                          // const today = dayjs();
                          // const minDate = today.subtract(1, "month");

                          // if (selectedDate.isBefore(minDate)) {
                          //   toast({
                          //     title: "Gagal Memilih Tanggal",
                          //     description: "Tanggal publikasi harus dalam rentang 1 bulan terakhir.",
                          //     variant: "destructive",
                          //   });
                          //   setPublicationDate(null);
                          // } else {
                          // }
                          setPublicationDate(selectedDate.format("YYYY-MM-DD"));
                        }}
                      />
                      <p className="text-sm text-gray-500 mt-1">* Tanggal publikasi hanya dapat diisi satu kali.</p>
                    </div>
                    <div className="w-full">
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
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button disabled={isLoadingPublication || isDisabled} type="submit">
                    {isLoadingPublication && <LoaderCircle className="animate-spin mr-1" />}Simpan{" "}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Show>
          {/*Dokumen verifikasi*/}
          <Show when={submission.has_send_to_guarantor}>
            <div>
              <h2 className="text-lg font-semibold mb-4 mt-5">Dokumen Verifikasi Dari {submission.guarantor?.name}</h2>
              <Card className="w-auto">
                <CardContent className="p-0">
                  <div className="flex flex-col items-center justify-center py-4">
                    <Show
                      when={submission.callback}
                      fallback={
                        <Button onClick={() => handleGetCallBackFromGuarantor(submission.id)} disabled={isDisabled}>
                          {isLoadingGetCallback && <LoaderCircle className="animate-spin mr-1" />}
                          Cek Respond Dari Asuransi
                        </Button>
                      }>
                      <>
                        <img src={submission.callback?.url} alt="Code QR" />
                        <Button
                          onClick={() => window.open(submission.callback?.doc_url, "_blank")}
                          disabled={isDisabled}>
                          Dokumen Pendukung
                        </Button>
                        <Button
                          className="mt-4"
                          onClick={handleEmbedQr}
                          disabled={isLoadingEmbedQr || submission.is_added_qrcode === 1 || isDisabled}>
                          <Loading isLoading={isLoadingEmbedQr} />
                          {isLoadingEmbedQr
                            ? "Memproses..."
                            : submission.is_added_qrcode === 1
                              ? "QR Code Sudah Dibubuhkan"
                              : "Bubuhkan QR Code"}
                        </Button>
                      </>
                    </Show>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Show>
          {/*final output file*/}
          <Show when={!submission.has_send_to_guarantor && !submission.final_output_file.length && isApproved}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitDoc();
              }}>
              <Card className="w-auto">
                <CardHeader className="p-2">
                  <CardTitle className="text-lg font-semibold">Dokumen SPKMGR dan Surat Permohonan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5 my-2">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Upload File SPKMgr</h3>
                      <FileInput
                        onFileChange={(file) => setSpkmgrFile(file)}
                        isLoading={isDisabled}
                        validation={["application/pdf"]}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-2">Upload File Permohonan yang Ditandatangani</h3>
                      <FileInput
                        onFileChange={(file) => setPermohonanFile(file)}
                        isLoading={isDisabled}
                        validation={["application/pdf"]}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button type="submit" disabled={isLoadingUpload || isDisabled}>
                    {isLoadingUpload && <LoaderCircle className="animate-spin mr-1" />}
                    {isLoadingUpload ? "Mengunggah..." : "Submit"}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Show>
          <Show when={submission.final_output_file.length && isApproved}>
            <Card className="w-auto">
              <CardHeader className="p-2">
                <CardTitle className="text-lg font-semibold">Dokumen Final</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4">
                  <RenderList
                    of={submission.final_output_file as Array<any>}
                    render={(file) => (
                      <div key={file.id} className="flex items-center justify-between">
                        <p>{file.name}</p>
                        <PreviewFile preview={file.url} />
                      </div>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </Show>
          {/*Pilih Blangko*/}
          {/* <Show when={isApproved && !submission.has_send_to_guarantor}>
            <Card className="w-auto">
              <CardHeader className="p-2">
                <CardTitle className="text-lg font-semibold">Pilih Blangko</CardTitle>
              </CardHeader>
              <CardContent>
                <Combobox
                  data={Array.isArray(blanks) ? blanks : []}
                  defaultValue={selectedBlank}
                  labelKey="number"
                  valueKey="id"
                  placeholder="Pilih blangko"
                  className="w-full"
                  onSelect={(val: any) => {
                    setSelectedBlank(val.id);
                  }}
                />
              </CardContent>
              <CardFooter className="justify-end">
                <Button
                  disabled={isDisabled}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSetBlank();
                  }}>
                  {isLoadingSetBlank && <LoaderCircle className="animate-spin mr-1" />}
                  Set Blangko
                </Button>
              </CardFooter>
            </Card>
          </Show> */}
          <div className="flex items-end space-x-2">
            <Show
              when={isApproved && !submission.has_send_to_guarantor}
              fallback={
                <>
                  {/* Button Revisi */}
                  <Show when={submission.can_revised}>
                    <Button variant={"outline"} className="w-full bg-yellow-500 hover:bg-yellow-400 rounded-sm" asChild>
                      <Link
                        disabled={isDisabled}
                        type="button"
                        href={route("staff-submission-revision", {
                          id: submission.id,
                        })}>
                        Revisi
                      </Link>
                    </Button>
                  </Show>
                  <Show when={!isRejected && !isRevised && !submission.has_send_to_guarantor}>
                    <Button variant="outline" className="w-full bg-yellow-500 hover:bg-yellow-400 rounded-sm" asChild>
                      <Link
                        type={"button"}
                        disabled={isDisabled}
                        href={route("staff-submission-edit", { id: submission.id })}>
                        Edit
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="bg-red-600 text-destructive-foreground shadow-sm hover:bg-red-400 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                          disabled={isLoadingDelete || isDisabled}>
                          Batal
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="sm:max-w-[425px]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Batalkan Pengajuan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin membatalkan pengajuan ini? Pengajuan yang sudah dibatalkan tidak
                            dapat dikembalikan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          <AlertDialogCancel asChild>
                            <Button variant="outline" className="w-full" type="button" disabled={isDisabled}>
                              Tidak
                            </Button>
                          </AlertDialogCancel>
                          <Button
                            variant="destructive"
                            className="w-full"
                            type="submit"
                            disabled={isLoadingDelete || isDisabled}
                            onClick={() => handleDelete(submission)}>
                            <Loading isLoading={isLoadingDelete} />
                            Batalkan Pengajuan
                          </Button>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </Show>
                </>
              }>
              {/*Kirim ke asuransi*/}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  {/* <Button
                    variant="default"
                    disabled={isLoadingSend || isDisabled || isWeekend}
                    className={cn(
                      "bg-green-600 text-destructive-foreground shadow-sm hover:bg-green-400 px-2 py-1.5 text-sm w-full rounded-sm text-start",
                      isWeekend && "bg-gray-400 cursor-not-allowed hover:bg-gray-400",
                    )}>
                    {isLoadingSend && <LoaderCircle className="animate-spin mr-1" />}
                    {isWeekend
                      ? "Tidak dapat mengirim ke " + submission.guarantor?.name + " (Hari Libur)"
                      : "Kirim Ke " + submission.guarantor?.name}
                  </Button> */}
                  <Button
                    variant="default"
                    disabled={isLoadingSend || isDisabled}
                    className="bg-green-600 text-destructive-foreground shadow-sm hover:bg-green-400 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                    {isLoadingSend && <LoaderCircle className="animate-spin mr-1" />}
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
              {/*Buttons*/}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <EllipsisVertical />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[8vw] space-y-2">
                  <Show when={!isRejected && !isRevised}>
                    <Button variant="outline" className="w-full bg-yellow-500 hover:bg-yellow-400 rounded-sm" asChild>
                      <Link
                        type={"button"}
                        disabled={isDisabled}
                        href={route("staff-submission-edit", { id: submission.id })}>
                        Edit
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="bg-red-600 text-destructive-foreground shadow-sm hover:bg-red-400 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                          disabled={isLoadingDelete || isDisabled}>
                          Batal
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="sm:max-w-[425px]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Batalkan Pengajuan</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin membatalkan pengajuan ini? Pengajuan yang sudah dibatalkan tidak
                            dapat dikembalikan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="grid grid-cols-2 gap-4">
                          <AlertDialogCancel asChild>
                            <Button variant="outline" className="w-full" type="button" disabled={isDisabled}>
                              Tidak
                            </Button>
                          </AlertDialogCancel>
                          <Button
                            variant="destructive"
                            className="w-full"
                            type="submit"
                            disabled={isLoadingDelete || isDisabled}
                            onClick={() => handleDelete(submission)}>
                            <Loading isLoading={isLoadingDelete} />
                            Batalkan Pengajuan
                          </Button>
                        </div>
                      </AlertDialogContent>
                    </AlertDialog>
                  </Show>
                  <Show when={isApproved && submission.has_send_to_guarantor && !isRevised}>
                    <Button variant={"outline"} className="w-full bg-yellow-500 hover:bg-yellow-400 rounded-sm" asChild>
                      <Link
                        disabled={isDisabled}
                        type="button"
                        href={route("staff-submission-revision", {
                          id: submission.id,
                        })}>
                        Revisi
                      </Link>
                    </Button>
                  </Show>
                </PopoverContent>
              </Popover>
            </Show>
          </div>
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
