import { useCompareRatios } from "@/common/hooks/general/use-compare-ratios";
import useStepper from "@/common/hooks/general/use-stepper";
import { toast } from "@/common/hooks/general/use-toast";
import { cn } from "@/common/utils/cn";
import { formatCurrency } from "@/common/utils/format-currency";
import { textCurrency } from "@/common/utils/text-currency";
import { Alert, AlertDescription, AlertTitle } from "@/components/_shadcn-ui/alert";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/_shadcn-ui/alert-dialog";
import { Badge } from "@/components/_shadcn-ui/badge";
import { Button } from "@/components/_shadcn-ui/button";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import TinyMCEEditor from "@/components/documents/tiny-mce-editor";
import { FileInput } from "@/components/molecules/input/file-input";
import { PreviewFile } from "@/components/molecules/preview-file";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { SubmissionStatus } from "@/types/submission-status";
import { router } from "@inertiajs/react";
import axios from "axios";
import { StringToBoolean } from "class-variance-authority/types";
import { AlertCircle, LoaderCircle } from "lucide-react";
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
        isActive: true
    },
    {
        title: "Review Dokumen Perusahaan",
        name: "docs",
        isActive: false
    },
    {
        title: "Detail Kontrak dan Dasar Pengajuan",
        name: "contract",
        isActive: false
    },
    {
        title: "Review Hasil Resume dan Skoring",
        name: "skoring",
        isActive: false
    },
    {
        title: "Persetujuan Pengajuan",
        name: "luaran",
        isActive: false
    }
];

const SubmissionDetailPage: SubmissionDetailPageProps = ({ submission }) => {
    const { currentStep, steps, gotoStep } = useStepper(initialSteps);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        handleComparisonRatios(submission.principal?.ratios as Array<any>);
    }, []);

    const isProcess = submission.status == SubmissionStatus.PROCESS;
    const isApproved = submission.status == SubmissionStatus.APPROVED;
    const isRejected = submission.status == SubmissionStatus.REJECTED;
    const colorAlert: StringToBoolean<any> = isProcess
        ? "warning"
        : isApproved
            ? "success"
            : isRejected
                ? "destructive"
                : "default";
    const isApprovedByDireksi = submission.approved_by_direksi;

    const generateNomorSurat = (createdAt: string): string => {
        const date = new Date(createdAt);
        if (isNaN(date.getTime())) return "Invalid date";

        const bulan = date.getMonth() + 1;
        const tahun = date.getFullYear();

        return `/BPR/${bulan}/${tahun}`;
    };

    const created_at = submission.created_at;
    const nomorSurat = generateNomorSurat(created_at);

    function formatToIndonesianDate(dateString: string): string {
        const months = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember"
        ];

        const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

        const date = new Date(dateString);

        const dayOfWeek = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }

    const formattedDate = formatToIndonesianDate(submission.created_at);

    console.log(submission);

    interface Analysis {
        character: number | string;
        capacity: number | string;
        capital: number | string;
        condition: number | string;
        collateral: number | string;
    }

    interface DataAnalyst {
        analysis: Analysis;
        scoring_result: number | string;
    }

    // Initialize analysis object
    const analysis: Analysis = {
        character: 0,
        capacity: 0,
        capital: 0,
        condition: 0,
        collateral: 0
    };

    // Assuming 'submission.scores' contains the necessary data
    const scoringResult = submission.scores.reduce((grouped: any, score: any) => {
        const { scoring_question_category_id, scoring_question_category, ...rest } = score;

        // Group scores by scoring_question_category_id
        if (!grouped[scoring_question_category_id]) {
            grouped[scoring_question_category_id] = {
                ...scoring_question_category,
                items: []
            };
        }
        grouped[scoring_question_category_id].items.push(rest);

        // Add points to the corresponding analysis category
        if (scoring_question_category.name === "Character") {
            analysis.character += score.point || 0;
        } else if (scoring_question_category.name === "Capacity") {
            analysis.capacity += score.point || 0;
        } else if (scoring_question_category.name === "Capital") {
            analysis.capital += score.point || 0;
        } else if (scoring_question_category.name === "Condition") {
            analysis.condition += score.point || 0;
        } else if (scoring_question_category.name === "Collateral") {
            analysis.collateral += score.point || 0;
        }

        return grouped;
    }, {});

    // Calculate total scoring result
    const scoringResultTotal = Object.values(analysis).reduce(
        (total, value) => total + (typeof value === "number" ? value : 0),
        0
    );

    // Create the dataAnalyst object
    const dataAnalyst: DataAnalyst = {
        analysis,
        scoring_result: scoringResultTotal
    };

    console.log(submission);

    const data = {
        principal: {
            name: submission.principal?.name || "",
            address: submission.principal?.address || "",
            npwp: submission.principal?.npwp || "",
            nib: submission.principal?.nib || "",
            //   signer_name: submission.principal?.signer_name || "",
            telephone: submission.principal?.telephone || "",
            director_name: submission.principal?.director_name || "",
            director_phone: submission.principal?.director_phone || "",
            pic: submission.principal?.pic || "",
            director_position: submission.principal?.director_position || "",
            location:
                submission.principal?.address +
                ", " +
                submission.principal?.district?.name +
                ", " +
                submission.principal?.regency?.name +
                ", " +
                submission.principal?.province?.name
        },
        obligee: {
            name: submission.obligee?.name || "",
            address: submission.obligee?.address || "",
            source_of_fund: submission.source_of_fund?.name || "",
            ppk_name: submission.obligee?.pic || "",
            city: submission.obligee?.district?.name,
            location: (
                submission.obligee?.address ||
                "" +
                ", " +
                (submission.obligee?.district?.name || "") +
                ", " +
                (submission.obligee?.regency?.name || "") +
                ", " +
                (submission.obligee?.province?.name || "")
            ).trim()
        },
        guarantor: {
            name: submission.guarantor?.name || "",
            address: submission.guarantor?.address || "",
            pic: submission.guarantor?.pic || "",
            location:
                submission.guarantor?.address +
                ", " +
                submission.guarantor?.district?.name +
                ", " +
                submission.guarantor?.regency?.name +
                ", " +
                submission.guarantor?.province?.name
        },
        guarantor_address: submission.guarantor_address || "",
        source_of_fund: {
            name: submission.source_of_fund.name
        },
        contract_value: submission.contract_value || 0,
        guarantee_value: submission.guarantee_value || 0,
        guarantee_type: submission.guarantor_to_product_type?.name || "",
        time_period: submission.time_period || "",
        job_name: submission.job_name || "",
        job_location_village: submission.job_location_village || "",
        contract_doc_name: submission.contract_doc_name || "",
        contract_doc_number: submission.contract_doc_number || "",
        contract_doc_date: submission.contract_doc_date || "",
        start_date: submission.start_date || "",
        end_date: submission.end_date || "",
        guarantee_issue_date: submission.guarantee_issue_date || "",
        submission_date: submission.created_at || "",
        // letter_date: submission.letter_date || "",
        // letter_number: submission.letter_number || "",
        analysis: {
            character: submission.scores?.find((score) => score?.category_name === "Character")?.point || "N/A",
            capacity: submission.scores?.find((score) => score?.category_name === "Capacity")?.point || "N/A",
            capital: submission.scores?.find((score) => score?.category_name === "Capital")?.point || "N/A",
            condition: submission.scores?.find((score) => score?.category_name === "Condition")?.point || "N/A",
            collateral: submission.scores?.find((score) => score?.category_name === "Collateral")?.point || "N/A"
        },
        scoring_result: submission.scores || "",
        // description: submission.description || "",
        date: submission.created_at || "",
        analyst_name: submission.analyst_name || "",
        manager_name: submission.principal?.commissioner || "",
        branch_manager: submission.principal?.director_name || "",
        job_location:
            submission.job_location_village +
            ", " +
            submission.district?.name +
            ", " +
            submission.regency?.name +
            ", " +
            submission.province?.name,
        job_group: submission.guarantor_to_product_type?.job_group,
        no: submission.id,
        city: submission.regency?.name
    };

    const calculateTotalPoint = (scores: any) => {
        return scores.reduce((total: number, score: any) => total + score.point, 0);
    };

    const { comparisonRatios, handleComparisonRatios } = useCompareRatios();

    //   const handleApprove = (submissionId: number) => {
    //     setIsLoading(true);
    //     axios
    //       .post(route("manager-submission-approve", submissionId))
    //       .then((response) => {
    //         console.log("success approve submission", response);
    //         router.reload();
    //       })
    //       .catch((error) => {
    //         console.log("error approve submission", error);
    //       })
    //       .finally(() => {
    //         setIsLoading(false);
    //       });
    //   };

    // DOCUMENT FORMAT
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

        character_score: string | number | undefined;
        capacity_score: string | number | undefined;
        capital_score: string | number | undefined;
        collateral_score: string | number | undefined;
        condition_score: string | number | undefined;
        total_score: string | number | undefined;
        recommendation: string | undefined;
        notes: string | undefined;
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
        principal_name: submission.principal?.name || "",
        location: submission.principal?.address || "",
        npwp: submission.principal?.npwp || "",
        nib: submission.principal?.nib || "",
        telephone: submission.principal?.telephone || "",
        director_name: submission.principal?.director_name || "",
        director_phone: submission.principal?.director_phone || "",
        bussiness_field: submission.principal?.bussiness_field || "",
        principal_commissioner: submission.principal?.commissioner || "",
        pic: submission.principal?.pic || "",
        director_position: submission.principal?.director_position || "",
        principal_address: `${submission.principal?.address}, ${submission.principal?.district?.name}, ${submission.principal?.regency?.name}, ${submission.principal?.province?.name}`,
        est_deed: submission.principal?.est_deed || "",
        last_deed: submission.principal?.last_deed || "",
        get_susunan_pengurus: submission.get_administators_principal || "",
        get_exp: submission.get_exp || "",

        // Informasi Bank & Obligee
        bank_name: submission.bank_name || "",
        obligee_name: submission.obligee?.name || "",
        obligee_address: submission.obligee?.address || "",
        source_of_fund: submission.source_of_fund?.name || "",
        ppk_name: submission.obligee?.pic || "",
        ppk_number: submission.obligee?.no_ppk || "",
        obligee_city: submission.obligee?.district?.name || "",
        obligee_location: `${submission.obligee?.address}, ${submission.obligee?.district?.name}, ${submission.obligee?.regency?.name}, ${submission.obligee?.province?.name}`,

        // Informasi Guarantor
        guarantor_name: submission.guarantor?.name || "",
        guarantor_address: submission.guarantor_address || "",
        guarantor_pic: submission.guarantor?.pic || "",
        guarantor_location: `${submission.guarantor?.address}, ${submission.guarantor?.district?.name}, ${submission.guarantor?.regency?.name}, ${submission.guarantor?.province?.name}`,

        // Informasi Kontrak & Proyek
        source_of_fund_name: submission.source_of_fund?.name || "",
        contract_value: submission.contract_value_formatted || 0,
        guarantee_value: submission.guarantee_value_formatted || 0,
        guarantee_type: submission.guarantor_to_product_type?.name || "",
        no_guarantee: submission.no_guarantee || "",
        time_period: submission.time_period || "",
        job_name: submission.job_name || "",
        job_location_village: submission.job_location_village || "",
        contract_doc_name: submission.contract_doc_name || "",
        contract_doc_number: submission.contract_doc_number || "",
        contract_doc_date: submission.contract_doc_date || "",
        start_date: submission.start_date || "",
        end_date: submission.end_date || "",
        guarantee_issue_date: submission.guarantee_issue_date || "",
        submission_date: submission.submission_date || "",
        day: submission.day_name || "",

        // SCORING
        character_score: submission.analysis?.character,
        capacity_score: submission.analysis?.capacity,
        capital_score: submission.analysis?.capital,
        collateral_score: submission.analysis?.collateral,
        condition_score: submission.analysis?.character,
        total_score: submission.total_score,

        recommendation: submission.recommendation,
        notes: submission.notes,
        analyst_name: submission.analyst_name || "",
        manager_technique_name: submission.principal?.commissioner || "",

        // Informasi Tambahan
        branch_manager: submission.principal?.director_name || "",
        job_location: `${submission.job_location_village}, ${submission.district?.name}, ${submission.regency?.name}, ${submission.province?.name}`,
        job_group: submission.guarantor_to_product_type?.job_group || "",
        no: submission.id || "",
        city: submission.regency?.name || "",
        mail_number: submission.mail_number || "",
        mail_number_resume: submission.mail_number_resume || "",
        underlying: submission.contract_doc_name + " " + submission.contract_doc_number + " " + submission.job_name || "",
        product_name: submission.product?.name || ""
    };

    //   const handleApprove = (submissionId: number): void => {
    //     setIsLoading(true);

    //     axios
    //       .post(route("manager-submission-approve", { id: submissionId }))
    //       .then((response) => {
    //         console.log("Success approve submission", response);
    //         router.reload();
    //       })
    //       .catch((error) => {
    //         console.error("Error approving submission", error);
    //       })
    //       .finally(() => {
    //         setIsLoading(false);
    //       });
    //   };

    const documentFormat = () => {
        return Object.keys(editorRefs.current).map((key) => {
            const allDocuments = [
                ...(Array.isArray(submission.document_format_guarantor) ? submission.document_format_guarantor : []),
                ...(Array.isArray(submission.document_format_product) ? submission.document_format_product : []),
                ...(Array.isArray(submission.document_format_type_guarantee) ? submission.document_format_type_guarantee : [])
            ];

            if (key === "hasil-analisis") {
                return {
                    id: submission.document_format_analysis?.id || "hasil-analisis",
                    name: "Resume Analisa Penjaminan",
                    content: editorRefs.current[key].getContent()
                };
            }

            const doc = allDocuments.find((d) => `editor-${d.id}` === key);

            return {
                id: doc ? doc.id : key,
                name: doc ? doc.name : key,
                content: editorRefs.current[key].getContent()
            };
        });
    };

    const handleApprove = (submissionId: number): void => {
        setIsLoading(true);

        const documents = documentFormat();

        axios
            .post(route("manager-submission-approve", { id: submissionId }), { documents })
            .then((response) => {
                console.log("Success approve submission", response);
                router.reload();
            })
            .catch((error) => {
                console.error("Error approving submission", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleReject = (submissionId: number) => {
        setIsLoading(true);
        const documents = documentFormat();

        axios
            .post(route("manager-submission-reject", submissionId), { documents })
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

    // handle check status
    const handleCheck = (submissionId: number) => {
        setIsLoading(true);

        axios
            .post(route("manager-submission-check", submissionId))
            .then((response) => {
                console.log("success check submission", response);
                router.reload();
            })
            .catch((error) => {
                console.log("error check submission", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleSendGuarantor = (submissionId: number) => {
        setIsLoading(true);
        axios
            .post(route("api.submission-management.send", { id: submissionId }))
            .then((response) => {
                console.log("Success Send To Guarantor", response);
                toast({
                    title: "Sukses",
                    description: "Pengajuan berhasil dikirim ke asuransi"
                });
                router.reload();
            })
            .catch((error) => {
                console.error("Error Send To Guarantor", error);
                toast({
                    title: "Gagal",
                    description: error.response.data.message,
                    variant: "destructive"
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const [spkmgrFile, setSpkmgrFile] = useState<File | null>(null);
    const [permohonanFile, setPermohonanFile] = useState<File | null>(null);

    const handleSubmitDoc = () => {
        if (!spkmgrFile && !permohonanFile) {
            alert("Harap pilih setidaknya satu file untuk diunggah.");
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        if (spkmgrFile) formData.append("spkmgr_file", spkmgrFile);
        if (permohonanFile) formData.append("permohonan_file", permohonanFile);
        if (submission.id) formData.append("submission_id", String(submission.id));

        axios
            .post(route("manager-submission-save-permohonan-doc.submission"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            .then((response) => {
                console.log("Success submit submission", response);
                toast({
                    title: "Dokumen berhasil diunggah!",
                    description: "Dokumen berhasil diunggah.",
                    variant: "default"
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
                    variant: "destructive"
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return (
        <>
            <Show when={submission.beyond_the_limit}>
                <div className="fixed top-20 w-[81%] z-[100]">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Peringatan</AlertTitle>
                        <AlertDescription>
                            Pengajuan Melebihi Batas Kewenangan Nilai Jaminan
                            Rp. {textCurrency(submission.guarantee_value)}
                        </AlertDescription>
                    </Alert>
                </div>
            </Show>
            {/* has_send_to_guarantor */}
            <Show when={(submission.has_send_to_guarantor as boolean) && (!submission.callback as boolean)}>
                <div className="fixed top-20 w-[73vw] z-[100]">
                    <Alert variant="warning">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Pemberitahuan</AlertTitle>
                        <AlertDescription>
                            Pengajuan telah dikirim ke {submission.guarantor?.name} dan menunggu hasil dari asuransi
                        </AlertDescription>
                    </Alert>
                </div>
            </Show>
            <main className={"space-y-10 w-[800px] mx-auto mt-[50px]"}>
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
                                                    "bg-black text-white": step.isActive
                                                }
                                            )}>
                                            {index + 1}
                                        </div>

                                        {/* STEPPER LABEL */}
                                        <span
                                            className={cn("transition-all duration-300 text-gray-500 mt-2 text-sm min-w-[100px]", {
                                                "text-black font-semibold": step.isActive
                                            })}>
                      {step.title}
                    </span>
                                    </button>

                                    {/* ARROW BETWEEN STEPPER */}
                                    {index < steps.length - 1 && (
                                        <div
                                            className={cn("w-full mt-5 h-1 mx-5 transition-all duration-300 bg-gray-300", {
                                                "bg-black": steps[index + 1].isActive
                                            })}
                                        />
                                    )}
                                </Fragment>
                            );
                        }}
                    />
                </div>
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
                                    <span>Pengajuan sedang diproses {submission.checked_at && "dan telah di kirim ke Direksi"}</span>
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
                                    of={submission.required_docs as Array<any>}
                                    render={(doc) => {
                                        return (
                                            <tr key={doc.id} className="border-b">
                                                <td className="p-2">{doc.name}</td>
                                                <td className="p-2">{doc.description || "-"}</td>
                                                <td className="p-2">
                                                    {doc?.url ?
                                                        <PreviewFile preview={doc.url} /> : "File Belum Diunggah"}
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
                                        year: "numeric"
                                    })}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2 font-semibold">Nilai Kontrak</td>
                                <td className="p-2">
                                    :{" "}
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR"
                                    }).format(submission.contract_value)}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2 font-semibold">Nilai Jaminan</td>
                                <td className="p-2">
                                    :{" "}
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR"
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
                                    {submission.guarantee_issue_date &&
                                        new Date(submission.guarantee_issue_date).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                </td>
                            </tr>
                            <tr className="border-b">
                                <td className="p-2 font-semibold">Lokasi Proyek</td>
                                <td className="p-2">: {data?.job_location}</td>
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
                                <td className="p-2">
                                    :{" "}
                                    {new Date(submission.start_date).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric"
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
                                        year: "numeric"
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
                                                <td className="p-2 font-semibold text-center w-1/2">
                                                    {formatCurrency(ratio.current_assets)}
                                                </td>
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
                                            return <td
                                                className="p-2 font-semibold text-center w-1/2">{formatCurrency(ratio.revenue)}</td>;
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
                                        of={submission.principal?.ratios as Array<any>}
                                        render={(ratio: any) => {
                                            return <td
                                                className="p-2 font-semibold text-center">{ratio.liquidity_ratios}</td>;
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
                                        of={submission.principal?.ratios as Array<any>}
                                        render={(ratio: any) => {
                                            return <td
                                                className="p-2 font-semibold text-center">{ratio.profitability_ratios}%</td>;
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
                                        of={submission.principal?.ratios as Array<any>}
                                        render={(ratio: any) => {
                                            return <td
                                                className="p-2 font-semibold text-center">{ratio.solvency_ratios}</td>;
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
                                    submission.scores.reduce((grouped: any, score: any) => {
                                        const {
                                            scoring_question_category_id,
                                            scoring_question_category,
                                            ...rest
                                        } = score;
                                        if (!grouped[scoring_question_category_id]) {
                                            grouped[scoring_question_category_id] = {
                                                ...scoring_question_category,
                                                items: []
                                            };
                                        }
                                        grouped[scoring_question_category_id].items.push(rest);
                                        return grouped;
                                    }, {})
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
                                                submission.scores?.[0]?.scoring?.min_point < calculateTotalPoint(submission.scores),
                                            "bg-red-300":
                                                submission.scores?.[0]?.scoring?.min_point >= calculateTotalPoint(submission.scores)
                                        })}>
                                        <span className="pr-1">Disarankan Untuk</span>
                                        {submission.scores?.[0]?.scoring?.min_point < calculateTotalPoint(submission.scores) ? (
                                            <span className="text-green-800">
                          Disetujui Karena Nilai {calculateTotalPoint(submission.scores)} Lebih Dari{" "}
                                                {submission.scores?.[0]?.scoring?.min_point}
                        </span>
                                        ) : (
                                            <span className="text-red-800">
                          Ditolak Karena
                                                {" Nilai " +
                                                    calculateTotalPoint(submission.scores) +
                                                    " Kurang Dari " +
                                                    submission.scores?.[0]?.scoring?.min_point}
                        </span>
                                        )}
                                    </td>
                                </tr>
                                </tfoot>
                            </table>
                        </div>
                    </Show>
                    <Show when={currentStep.name === "luaran"}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmitDoc();
                            }}
                            className="space-y-16">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Upload File SPKMgr</h3>
                                <FileInput onFileChange={(file) => setSpkmgrFile(file)} />
                                {/* {spkmgrFile && <p className="text-green-500 text-sm mt-2">File: {spkmgrFile.name}</p>}
                {!spkmgrFile && <p className="text-red-500 text-sm mt-2">File SPKMgr belum diunggah.</p>} */}
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Upload File Permohonan yang
                                    Ditandatangani</h3>
                                <FileInput onFileChange={(file) => setPermohonanFile(file)} />
                                {/* {permohonanFile && <p className="text-green-500 text-sm mt-2">File: {permohonanFile.name}</p>}
                {!permohonanFile && <p className="text-red-500 text-sm mt-2">File Permohonan belum diunggah.</p>} */}
                            </div>

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Mengunggah..." : "Submit"}
                            </Button>
                        </form>
                        <br />

                        {submission.submission_docs?.length > 0 ? (
                            <table className="table-auto w-full border-collapse">
                                <thead>
                                <tr className="border-b bg-gray-200">
                                    <th className="p-2 text-left">Nama Dokumen</th>
                                    <th className="p-2 text-left">Tindakan</th>
                                </tr>
                                </thead>
                                <tbody>
                                <RenderList
                                    of={submission.submission_docs as Array<any>}
                                    render={(docSig) => (
                                        <tr key={docSig.id} className="border-b">
                                            <td className="p-2" title={docSig.name}>
                                                {docSig.name.length > 30 ? `${docSig.name.slice(0, 30)}...` : docSig.name}
                                            </td>
                                            <td className="p-2">
                                                {docSig?.url ?
                                                    <PreviewFile preview={docSig.url} /> : "File Belum Diunggah"}
                                            </td>
                                        </tr>
                                    )}
                                />
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-gray-500">Dokumen SPKMGR dan Suart Permohonan Belum ditandatangani</p>
                        )}

                        <div>
                            <h2 className="text-lg font-semibold mb-4 mt-5">Resume Analisa Penjaminan</h2>
                            <div>
                                <TinyMCEEditor
                                    id="hasil-analisis"
                                    onInit={(evt, editor) => (editorRefs.current["hasil-analisis"] = editor)}
                                    initialContent={replacePlaceholders(
                                        submission.document_format_analysis?.format_document,
                                        dataTemplate
                                    )}
                                />
                            </div>
                        </div>

                        <div>
                            <div>
                                {(() => {
                                    const documentsToDisplay: JSX.Element[] = [];

                                    // Untuk document_format_guarantor
                                    if (submission.document_format_guarantor?.length) {
                                        submission.document_format_guarantor.forEach((doc: any) => {
                                            documentsToDisplay.push(
                                                <div key={doc.id} style={{ marginBottom: "20px" }}>
                                                    <h3 className="text-lg font-semibold mb-4 mt-5">{doc.name}</h3>
                                                    <TinyMCEEditor
                                                        id={doc.name.replace(/\s+/g, "-").toLowerCase()}
                                                        initialContent={replacePlaceholders(doc.format_document, dataTemplate)}
                                                        onInit={(evt, editor) => (editorRefs.current[`editor-${doc.id}`] = editor)}
                                                    />
                                                </div>
                                            );
                                        });
                                    }

                                    // Untuk document_format_product
                                    if (submission.document_format_product?.length) {
                                        submission.document_format_product.forEach((doc: any) => {
                                            documentsToDisplay.push(
                                                <div key={doc.id} style={{ marginBottom: "20px" }}>
                                                    <h3 className="text-lg font-semibold mb-4 mt-5">{doc.name}</h3>
                                                    <TinyMCEEditor
                                                        id={doc.name.replace(/\s+/g, "-").toLowerCase()}
                                                        initialContent={replacePlaceholders(doc.format_document, dataTemplate)}
                                                        onInit={(evt, editor) => (editorRefs.current[`editor-${doc.id}`] = editor)}
                                                    />
                                                </div>
                                            );
                                        });
                                    }

                                    // Untuk document_format_type_guarantee
                                    if (submission.document_format_type_guarantee?.length) {
                                        submission.document_format_type_guarantee.forEach((doc: any) => {
                                            documentsToDisplay.push(
                                                <div key={doc.id} style={{ marginBottom: "20px" }}>
                                                    <h3 className="text-lg font-semibold mb-4 mt-5">{doc.name}</h3>
                                                    <TinyMCEEditor
                                                        id={doc.name.replace(/\s+/g, "-").toLowerCase()}
                                                        initialContent={replacePlaceholders(doc.format_document, dataTemplate)}
                                                        onInit={(evt, editor) => (editorRefs.current[`editor-${doc.id}`] = editor)}
                                                    />
                                                </div>
                                            );
                                        });
                                    }

                                    if (documentsToDisplay.length > 0) {
                                        return documentsToDisplay;
                                    }

                                    return <p className="text-gray-500">Tidak ada dokumen yang tersedia untuk
                                        ditampilkan.</p>;
                                })()}
                            </div>
                        </div>
                        <Show
                            when={
                                submission.status === SubmissionStatus.PROCESS &&
                                !submission.beyond_the_limit &&
                                !submission.checked_at &&
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
                                            <AlertDialogTitle>Apakah Anda Yakin ingin menolak pengajuan
                                                ini?</AlertDialogTitle>
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
                                            <AlertDialogTitle>Apakah Anda Yakin ingin menyetujui pengajuan
                                                ini?</AlertDialogTitle>
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
                        <Show
                            when={
                                submission.status === SubmissionStatus.PROCESS &&
                                submission.beyond_the_limit &&
                                !submission.checked_at &&
                                !submission.approved_at &&
                                !submission.rejected_at
                            }>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="default"
                                        disabled={isLoading}
                                        className="bg-yellow-400 text-destructive-foreground shadow-sm hover:bg-yellow-200 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                                        {isLoading && <LoaderCircle className="animate-spin mr-1" />}
                                        Kirim Ke Direksi
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Apakah Anda Yakin ingin mengirimkan pengajuan ini ke
                                            direksi?</AlertDialogTitle>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Batal</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-yellow-600 hover:bg-yellow-200"
                                            onClick={() => submission.id && handleCheck(submission.id)}>
                                            Kirim
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </Show>
                        <Show
                            when={
                                (!submission.callback || !submission.has_send_to_guarantor) &&
                                (submission.status === SubmissionStatus.APPROVED || submission.status === SubmissionStatus.REJECTED)
                            }>
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
                                        <AlertDialogTitle>Apakah Anda Yakin ingin menolak pengajuan
                                            ini?</AlertDialogTitle>
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
                    </Show>

                    {/* <Show
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
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">Upload Dokumen Pendukung</label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      />
                      {!isFileUploaded && (
                        <p className="text-red-500 text-sm mt-2">File wajib diunggah sebelum menyetujui.</p>
                      )}
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      className={`bg-green-600 hover:bg-green-400 ${!isFileUploaded ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={handleApproveClick}
                      disabled={!isFileUploaded}>
                      Setujui
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Show> */}
                </div>
            </main>
        </>
    );
};

export default SubmissionDetailPage;

SubmissionDetailPage.layout = (page: any) => {
    const pagePropsData = page.props;

    return (
        <RoleBasedLayout propsData={pagePropsData}>
            <div
                className={cn({
                    "mt-[7%]":
                        pagePropsData?.submission.beyond_the_limit ||
                        pagePropsData?.submission.has_send_to_guarantor ||
                        !pagePropsData?.submission.callback
                })}>
                <SubmissionDetailHeader title={"Detail Pengajuan"} />
                {page}
            </div>
        </RoleBasedLayout>
    );
};
