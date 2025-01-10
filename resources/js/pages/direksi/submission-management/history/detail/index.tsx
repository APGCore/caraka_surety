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
import { formatCurrency } from "@/lib/format-currency";
import { textCurrency } from "@/lib/text-currency";
import templateDraftSurety from "@/pages/output_templates/template-draft-surety";
import templateHasilAnalisa from "@/pages/output_templates/template-hasil-analisa";
import templateSpkmgrBumida from "@/pages/output_templates/template-spkmgr-bumida";
import templateSpkmgrJastan from "@/pages/output_templates/template-spkmgr-jastan";
import templateSpkmgrVidei from "@/pages/output_templates/template-spkmgr-videi";
import templatePelaksanaan from "@/pages/output_templates/template-surat-pelaksanaan";
import templateBankGaransi from "@/pages/output_templates/template-surat-permohonan-bank-garansi";
import templateBumida from "@/pages/output_templates/template-surat-permohonan-surety-bond-bumida";
import templateJastan from "@/pages/output_templates/template-surat-permohonan-surety-bond-jastan";
import templateVidei from "@/pages/output_templates/template-surat-permohonan-surety-bond-videi";
import { SubmissionStatus } from "@/types/submission-status";
import { router } from "@inertiajs/react";
import axios from "axios";
import { AlertCircle, LoaderCircle } from "lucide-react";
import React, { Fragment, useEffect, useRef, useState } from "react";
import tinymce from "tinymce";
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
  const { currentStep, steps, gotoStep } = useStepper(initialSteps);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    handleComparisonRatios(submission?.principal?.ratios);
  }, []);

  const currentDate = new Date();
  const options = { year: "numeric" as const, month: "long" as const, day: "numeric" as const };
  //   const formattedDate = currentDate.toLocaleDateString("id-ID", options).toUpperCase();
  const isProcess = submission?.status == SubmissionStatus.PROCESS;
  const isApproved = submission?.status == SubmissionStatus.APPROVED;
  const isRejected = submission?.status == SubmissionStatus.REJECTED;

  const generateNomorSurat = (createdAt: string): string => {
    const date = new Date(createdAt);
    if (isNaN(date.getTime())) return "Invalid date";

    const bulan = date.getMonth() + 1;
    const tahun = date.getFullYear();

    return `/BPR/${bulan}/${tahun}`;
  };

  const created_at = submission?.created_at;
  const nomorSurat = generateNomorSurat(created_at);

  console.log(created_at);

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
      "Desember",
    ];

    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

    const date = new Date(dateString);

    const dayOfWeek = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  }

  const formattedDate = formatToIndonesianDate(submission?.created_at);

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
    collateral: 0,
  };

  // Assuming 'submission?.scores' contains the necessary data
  const scoringResult = submission?.scores.reduce((grouped: any, score: any) => {
    const { scoring_question_category_id, scoring_question_category, ...rest } = score;

    // Group scores by scoring_question_category_id
    if (!grouped[scoring_question_category_id]) {
      grouped[scoring_question_category_id] = {
        ...scoring_question_category,
        items: [],
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
    0,
  );

  // Create the dataAnalyst object
  const dataAnalyst: DataAnalyst = {
    analysis,
    scoring_result: scoringResultTotal,
  };

  const replaceDraftSuretyPlaceholders = (template: string, data: any) => {
    return template
      .replace("[NOMOR_SURETY_BOND]", data?.surety_bond_number || "")
      .replace("[NILAI_JAMINAN]", formatCurrency(data?.guarantee_value))
      .replace("[NAMA_PENJAMIN]", data?.guarantor?.name || "")
      .replace("[ALAMAT_PENJAMIN]", data?.guarantor?.location || "")
      .replace("[ALAMAT_PRINCIPAL]", data?.principal?.location || "")
      .replace("[NAMA_PRINCIPAL2]", data?.principal?.name || "")
      .replace("[NAMA_OBLIGEE]", data?.obligee?.name || "")
      .replace("[ALAMAT_OBLIGEE]", data?.obligee?.location || "")
      .replace("[BESARAN_NILAI_JAMINAN]", formatCurrency(data?.guarantee_value))
      .replace("[NAMA_PEKERJAAN]", data?.job_name || "")
      .replace("[NOMOR_KONTRAK]", data?.contract_doc_number || "")
      .replace("[TANGGAL_KONTRAK]", data?.contract_doc_date || "")
      .replace("[START_DATE]", formatToIndonesianDate(data?.start_date) || "")
      .replace("[END_DATE]", formatToIndonesianDate(data?.end_date) || "")
      .replace("[TIME_PERIOD]", data?.time_period || "")
      .replace("[TANGGAL_PENERBITAN]", formatToIndonesianDate(data?.guarantee_issue_date) || "")
      .replace("[NAMA_PENJAMIN_TTD]", data?.guarantor.signer_name || "")
      .replace("[NAMA_PRINCIPAL_TTD]", data?.guarantor.name || "")
      .replace("[NAMA_PENANGGUNG_JAWAB_PENJAMIN]", data?.guarantor?.pic || "")
      .replace("[JABATAN_PENJAMIN]", data?.guarantor.position || "")
      .replace("[NAMA_KEPALA_CABANG]", data?.branch_manager || "");
  };

  const replaceHasilAnalisaPlaceholders = (template: string, data: any) => {
    return template
      .replace("[NAMA_JAMINAN]", data?.guarantee_type || "")
      .replace("[NAMA_PRINCIPAL]", data?.principal.name || "")
      .replace("[NOMOR_SURAT]", data?.no + nomorSurat || "")
      .replace("[TGL_PENGAJUAN]", formattedDate || "")
      .replace("[NAMA_TERJAMIN]", data?.principal?.name || "")
      .replace("[ALAMAT_TERJAMIN]", data?.principal?.location || "")
      .replace("[NAMA_PENANGGUNG_JAWAB]", data?.principal?.director_name || "")
      .replace("[JABATAN_PENANGGUNG_JAWAB]", data?.principal?.director_position || "")
      .replace("[AKTA_PENDIRIAN]", data?.deed_of_establishment || "-")
      .replace("[AKTA_PERUBAHAN]", data?.deed_of_amendment || "-")
      .replace("[NAMA_PRINCIPAL2]", data?.principal?.name || "")
      .replace("[NPWP]", data?.principal?.npwp || "")
      .replace("[NIB]", data?.principal?.nib || "")
      .replace("[NAMA_PENGURUS_1]", data?.principal?.director_name || "")
      .replace("[JABATAN_PENGURUS_1]", data?.principal?.director_position || "")
      .replace("[NAMA_PENGURUS_2]", data?.management_2_name || "")
      .replace("[JABATAN_PENGURUS_2]", data?.management_2_position || "")
      .replace("[NAMA_OBLIGEE]", data?.obligee?.name || "")
      .replace("[NAMA_PPK]", data?.obligee?.ppk_name || "")
      .replace("[ALAMAT_OBLIGEE]", data?.obligee?.location || "")
      .replace("[SUMBER_DANA]", data?.obligee?.source_of_fund || "")
      .replace("[NILAI_KONTRAK]", formatCurrency(data?.contract_value || 0))
      .replace("[NILAI_JAMINAN]", formatCurrency(data?.guarantee_value || 0))
      .replace("[JENIS_JAMINAN]", data?.guarantee_type || "")
      .replace("[JANGKA_WAKTU]", data?.time_period || "")
      .replace("[NAMA_PEKERJAAN]", data?.job_name || "")
      .replace("[LOKASI_PROYEK]", data?.job_location || "")
      .replace("[UNDERLYING]", data?.contract_doc_name + " " + data?.contract_doc_number + " " + data?.job_name || "")
      .replace("[NAMA_PROYEK]", data?.project_name || "")
      .replace("[NILAI_PROYEK]", formatCurrency(data?.project_value || 0))
      .replace("[ANALISA_CHARACTER]", String(dataAnalyst?.analysis?.character) || "")
      .replace("[ANALISA_CAPACITY]", String(dataAnalyst?.analysis?.capacity) || "")
      .replace("[ANALISA_CAPITAL]", String(dataAnalyst?.analysis?.capital) || "")
      .replace("[ANALISA_CONDITION]", String(dataAnalyst?.analysis?.condition) || "")
      .replace("[ANALISA_COLLATERAL]", String(dataAnalyst?.analysis?.collateral) || "")
      .replace("[HASIL_SCORING]", String(dataAnalyst?.scoring_result) || "")
      .replace("[KETERANGAN]", data?.description || "")
      .replace("[TANGGAL]", formattedDate || "")
      .replace("[NAMA_ANALIS]", data?.analyst_name || "")
      .replace("[NAMA_MANAJER]", data?.manager_name || "");
  };

  const replacePelaksanaanPlaceholders = (template: string, data: any) => {
    return template
      .replace("[NILAI_JAMINAN]", formatCurrency(data?.guarantee_value || 0))
      .replace("[NAMA_PRINCIPAL]", data?.principal?.name || "")
      .replace("[ALAMAT_PRINCIPAL]", data?.principal?.location || "")
      .replace("[NAMA_OBLIGEE]", data?.obligee?.name || "")
      .replace("[ALAMAT_OBLIGEE]", data?.obligee?.location || "")
      .replace("[BESARAN_NILAI_JAMINAN]", formatCurrency(data?.guarantee_value || 0))
      .replace("[NAMA_PEKERJAAN]", data?.job_name || "")
      .replace("[NAMA_DOKUMEN]", data?.contract_doc_name || "")
      .replace("[NOMOR_DOKUMEN]", data?.contract_doc_number || "")
      .replace("[TANGGAL_DOKUMEN]", data?.contract_doc_date || "")
      .replace("[JANGKA_WAKTU]", data?.time_period || "")
      .replace("[START_DATE]", formatToIndonesianDate(data?.start_date) || "")
      .replace("[END_DATE]", formatToIndonesianDate(data?.end_date) || "")
      .replace(
        "[TANGGAL_PENERBITAN]",
        data?.guarantee_issue_date ? formatToIndonesianDate(data?.guarantee_issue_date) : "",
      )
      .replace("[NAMA_PRINCIPAL_TTD]", data?.principal?.name || "")
      .replace("[NAMA_PIC]", data?.pic_name || "")
      .replace("[JABATAN]", data?.pic_position || "")
      .replace("[NAMA_ASURANSI]", data?.guarantor?.name || "")
      .replace("[NAMA_ASURANSI_ATAS]", data?.guarantor?.name || "")
      .replace("[ALAMAT_ASURANSI_ATAS]", data?.guarantor?.location || "")
      .replace("[NAMA_KEPALA_CABANG_TTD]", data?.guarantor?.pic || "")
      .replace("[NAMA_PIC_PRINCIPAL_TTD]", data?.principal?.director_name || "");
  };

  const replacePermohonanBankGaransiPlaceholders = (template: string, data: any) => {
    return template
      .replace("[TANGGAL_PENERBITAN_PERMOHONAN]", formattedDate || "")
      .replace("[NAMA_BANK]", data?.bank_name || "")
      .replace("[NAMA_PRINCIPAL]", data?.principal?.name || "")
      .replace("[ALAMAT_PRINCIPAL]", data?.principal?.location || "")
      .replace("[NPWP]", data?.principal?.npwp || "")
      .replace("[NAMA_PENANGGUNG_JAWAB]", data?.principal?.director_name || "")
      .replace("[JABATAN_PENANGGUNG_JAWAB]", data?.principal?.director_position || "")
      .replace("[JENIS_JAMINAN]", data?.guarantee_type || "")
      .replace("[PENERBIT_BANK_GARANSI]", data?.bank_guarantee_issuer || "")
      .replace("[PROYEK]", data?.project_name || "")
      .replace("[ALAMAT_PEMILIK_PROYEK]", data?.project_owner_address || "")
      .replace("[NAMA_PEKERJAAN]", data?.job_name || "")
      .replace("[NILAI_JAMINAN]", formatCurrency(data?.guarantee_value || 0))
      .replace("[TIME_PERIOD]", data?.time_period || "")
      .replace("[START_DATE]", formatToIndonesianDate(data?.start_date) || "")
      .replace("[END_DATE]", formatToIndonesianDate(data?.end_date) || "")
      .replace("[DASAR_DOKUMEN]", data?.contract_doc_name + " " + data?.contract_doc_number || "")
      .replace("[NAMA_PRINCIPAL_TTD]", data?.principal.name || "")
      .replace("[NAMA_PENANGGUNG_JAWAB_TTD]", data?.principal.director_name || "")
      .replace("[JABATAN_PENANGGUNG_JAWAB]", data?.principal.director_position || "");
  };

  const replaceBumidaPlaceholders = (template: string, data: any) => {
    return template
      .replace("[TANGGAL_SURAT]", formattedDate || "")
      .replace("[NOMOR_SURAT]", data?.letter_number || "")
      .replace("[NAMA_PENJAMIN]", data?.guarantor?.name || "")
      .replace("[NAMA_PERUSAHAAN]", data?.principal?.name || "")
      .replace("[ALAMAT_PERUSAHAAN]", data?.principal?.location || "")
      .replace("[PIC]", data?.principal?.pic || "")
      .replace("[NAMA_JAMINAN]", data?.guarantee_type || "")
      .replace("[NILAI_JAMINAN]", formatCurrency(data?.guarantee_value || 0))
      .replace("[JANGKA_WAKTU]", data?.time_period || "")
      .replace("[NAMA_PROYEK]", data?.job_name || "")
      .replace("[DASAR_JAMINAN]", data?.contract_doc_name || "")
      .replace("[NAMA_OBLIGEE]", data?.obligee?.name || "")
      .replace("[ALAMAT_OBLIGEE]", data?.obligee?.location || "")
      .replace("[NAMA_PENANGGUNG_JAWAB]", data?.principal?.director_name || "");
  };

  const replaceJastanPlaceholders = (template: string, data: any) => {
    return template
      .replace("[PERUSAHAAN/BADAN_HUKUM]", data?.principal?.name || "")
      .replace("[ALAMAT_LENGKAP]", data?.principal?.location || "")
      .replace("[NOMOR_TELEPON_FAX]", data?.principal?.telephone || "")
      .replace("[PEJABAT_YANG_BERURUSAN]", data?.principal?.director_name || "")
      .replace("[NAMA_OBLIGEE]", data?.obligee?.name || "")
      .replace("[ALAMAT_OBLIGEE]", data?.obligee?.location || "")
      .replace("[JENIS_JAMINAN]", data?.guarantee_type || "")
      .replace("[NILAI_JAMINAN]", formatCurrency(data?.guarantee_value || 0))
      .replace("[START_DATE]", formatToIndonesianDate(data?.start_date) || "")
      .replace("[END_DATE]", formatToIndonesianDate(data?.end_date) || "")
      .replace("[NAMA_PROYEK]", data?.job_name || "")
      .replace("[JENIS_PROYEK]", data?.job_group || "")
      .replace("[NILAI_PROYEK]", formatCurrency(data?.contract_value || 0))
      .replace("[LOKASI_PROYEK]", data?.job_location || "")
      .replace("[SUMBER_DANA]", data?.source_of_fund.name || "")
      .replace("[DOKUMEN_PENDUKUNG]", data?.contract_doc_name || "")
      .replace("[NAMA_KOTA]", data?.city || "")
      .replace("[TANGGAL_SURAT]", formattedDate || "")
      .replace("[NAMA_PRINCIPAL_TTD]", data?.principal?.name || "");
  };

  const replaceVideiPlaceholders = (template: string, data: any) => {
    return template
      .replace("[NAMA_PRINCIPAL]", data?.principal?.name || "")
      .replace("[ALAMAT_PRINCIPAL]", data?.principal?.location || "")
      .replace("[NAMA_DIREKSI]", data?.principal?.director_name || "")
      .replace("[KONTAK_PERSON]", data?.principal?.director_phone || "")
      .replace("[BIDANG_USAHA]", data?.principal?.business_field || "")
      .replace("[JENIS_JAMINAN]", data?.guarantee_type || "")
      .replace("[NILAI_PENJAMINAN]", formatCurrency(data?.guarantee_value || 0))
      .replace("[PERIODE_JAMINAN]", data?.time_period || "")
      .replace("[TANGGAL_PENERBITAN]", data?.contract_doc_date || "")
      .replace("[NAMA_OBLIGEE]", data?.obligee?.name || "")
      .replace("[ALAMAT_OBLIGEE]", data?.obligee?.location || "")
      .replace("[NAMA_PROYEK]", data?.job_name || "")
      .replace("[LOKASI_PROYEK]", data?.job_location || "")
      .replace("[NILAI_PROYEK]", formatCurrency(data?.contract_value || 0))
      .replace("[DOKUMEN_SURAT]", data?.letter_document || "")
      .replace("[TANGGAL_SURAT]", formattedDate || "")
      .replace("[NAMA_DIREKTUR]", data?.principal?.director_name || "");
  };

  const calculateTotalPoint = (scores: any) => {
    return scores.reduce((total: number, score: any) => total + score.point, 0);
  };

  //   document format implementation
  interface SubmissionData {
    principal_name: string;
    principal_address: string;
    npwp: string;
    nib: string;
    telephone: string;
    director_name: string;
    director_phone: string;
    bussiness_field: string;
    pic: string;
    director_position: string;
    location: string;

    obligee_name: string;
    obligee_address: string;
    source_of_fund: string;
    ppk_name: string;
    obligee_city: string;
    obligee_location: string;

    guarantor_name: string;
    guarantor_address: string;
    guarantor_pic: string;
    guarantor_location: string;

    source_of_fund_name: string;
    contract_value: number;
    guarantee_value: number;
    guarantee_type: string;
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
    analysis: {
      character: string | number;
      capacity: string | number;
      capital: string | number;
      condition: string | number;
      collateral: string | number;
    };
    scoring_result: {
      id: number;
      scoring_id: number;
      scoring: any;
      scoring_question_category_id: number;
      scoring_question_category: any;
      scoring_question_id: number;
      scoring_question: any;
      scoring_option_id: number;
      scoring_option: any;
      point: number;
      category_name: string;
      question_name: string;
      option_name: string;
      reduce: any;
      grouped: string;
      score: any;
    };
    date: string;
    manager_name: string;
    branch_manager: string;
    job_location: string;
    job_group: string;
    no: string | number;
    city: string;
    [key: string]: any;
  }
  const editorRefs = useRef<{ [key: string]: any }>({});

  // Fungsi untuk mengganti placeholder dalam template
  const replacePlaceholders = (template: string, data: SubmissionData): string => {
    return template.replace(/\[([A-Z_]+)\]/g, (_, key: string) => {
      const value = data[key.toLowerCase()];
      return value !== undefined ? value : `[${key}]`;
    });
  };

  // Mapping data ke struktur `SubmissionData`
  const dataTemplate: SubmissionData = {
    principal_name: submission.principal?.name || "",
    principal_address: submission.principal?.address || "",
    npwp: submission.principal?.npwp || "",
    nib: submission.principal?.nib || "",
    telephone: submission.principal?.telephone || "",
    director_name: submission.principal?.director_name || "",
    director_phone: submission.principal?.director_phone || "",
    bussiness_field: submission.principal?.bussiness_field || "",
    pic: submission.principal?.pic || "",
    director_position: submission.principal?.director_position || "",
    location: `${submission.principal?.address}, ${submission.principal?.district?.name}, ${submission.principal?.regency?.name}, ${submission.principal?.province?.name}`,

    obligee_name: submission.obligee?.name || "",
    obligee_address: submission.obligee?.address || "",
    source_of_fund: submission.source_of_fund?.name || "",
    ppk_name: submission.obligee?.pic || "",
    obligee_city: submission.obligee?.district?.name || "",
    obligee_location: `${submission.obligee?.address}, ${submission.obligee?.district?.name}, ${submission.obligee?.regency?.name}, ${submission.obligee?.province?.name}`,

    guarantor_name: submission.guarantor?.name || "",
    guarantor_address: submission.guarantor?.address || "",
    guarantor_pic: submission.guarantor?.pic || "",
    guarantor_location: `${submission.guarantor?.address}, ${submission.guarantor?.district?.name}, ${submission.guarantor?.regency?.name}, ${submission.guarantor?.province?.name}`,

    source_of_fund_name: submission.source_of_fund?.name || "",
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

    analysis: {
      character: submission.scores?.find((score) => score?.category_name === "Character")?.point || "N/A",
      capacity: submission.scores?.find((score) => score?.category_name === "Capacity")?.point || "N/A",
      capital: submission.scores?.find((score) => score?.category_name === "Capital")?.point || "N/A",
      condition: submission.scores?.find((score) => score?.category_name === "Condition")?.point || "N/A",
      collateral: submission.scores?.find((score) => score?.category_name === "Collateral")?.point || "N/A",
    },

    scoring_result: calculateTotalPoint(submission.scores) || "",
    date: submission.created_at || "",
    manager_name: submission.principal?.commissioner || "",
    branch_manager: submission.principal?.director_name || "",
    job_location: `${submission.job_location_village}, ${submission.district?.name}, ${submission.regency?.name}, ${submission.province?.name}`,
    job_group: submission.guarantor_to_product_type?.job_group || "",
    no: submission.id || "",
    city: submission.regency?.name || "",
  };

  const data = {
    principal: {
      name: submission?.principal?.name || "",
      address: submission?.principal?.address || "",
      npwp: submission?.principal?.npwp || "",
      nib: submission?.principal?.nib || "",
      //   signer_name: submission?.principal?.signer_name || "",
      telephone: submission?.principal?.telephone || "",
      director_name: submission?.principal?.director_name || "",
      director_phone: submission?.principal?.director_phone || "",
      pic: submission?.principal?.pic || "",
      director_position: submission?.principal?.director_position || "",
      location:
        submission?.principal?.address +
        ", " +
        submission?.principal?.district?.name +
        ", " +
        submission?.principal?.regency?.name +
        ", " +
        submission?.principal?.province?.name,
    },
    obligee: {
      name: submission?.obligee?.name || "",
      address: submission?.obligee?.address || "",
      source_of_fund: submission?.source_of_fund?.name || "",
      ppk_name: submission?.obligee?.pic || "",
      city: submission?.obligee?.district?.name,
      location:
        submission?.obligee?.address +
        ", " +
        submission?.obligee?.district?.name +
        ", " +
        submission?.obligee?.regency?.name +
        ", " +
        submission?.obligee?.province?.name,
    },
    guarantor: {
      name: submission?.guarantor?.name || "",
      address: submission?.guarantor?.address || "",
      pic: submission?.guarantor?.pic || "",
      location:
        submission?.guarantor?.address +
        ", " +
        submission?.guarantor?.district?.name +
        ", " +
        submission?.guarantor?.regency?.name +
        ", " +
        submission?.guarantor?.province?.name,
    },
    source_of_fund: {
      name: submission?.source_of_fund.name,
    },
    contract_value: submission?.contract_value || 0,
    guarantee_value: submission?.guarantee_value || 0,
    guarantee_type: submission?.guarantor_to_product_type?.name || "",
    time_period: submission?.time_period || "",
    job_name: submission?.job_name || "",
    job_location_village: submission?.job_location_village || "",
    contract_doc_name: submission?.contract_doc_name || "",
    contract_doc_number: submission?.contract_doc_number || "",
    contract_doc_date: submission?.contract_doc_date || "",
    start_date: submission?.start_date || "",
    end_date: submission?.end_date || "",
    guarantee_issue_date: submission?.guarantee_issue_date || "",
    submission_date: submission?.created_at || "",
    // letter_date: submission?.letter_date || "",
    // letter_number: submission?.letter_number || "",
    analysis: {
      character: submission?.scores?.find((score) => score?.category_name === "Character")?.point || "N/A",
      capacity: submission?.scores?.find((score) => score?.category_name === "Capacity")?.point || "N/A",
      capital: submission?.scores?.find((score) => score?.category_name === "Capital")?.point || "N/A",
      condition: submission?.scores?.find((score) => score?.category_name === "Condition")?.point || "N/A",
      collateral: submission?.scores?.find((score) => score?.category_name === "Collateral")?.point || "N/A",
    },
    scoring_result: submission?.scores || "",
    // description: submission?.description || "",
    date: submission?.created_at || "",
    // analyst_name: submission?.analyst_name || "",
    manager_name: submission?.principal?.commissioner || "",
    branch_manager: submission?.principal?.director_name || "",
    job_location:
      submission?.job_location_village +
      ", " +
      submission?.district?.name +
      ", " +
      submission?.regency?.name +
      ", " +
      submission?.province?.name,
    job_group: submission?.guarantor_to_product_type?.job_group,
    no: submission?.id,
    city: submission?.regency?.name,
  };

  const { comparisonRatios, handleComparisonRatios } = useCompareRatios();

  const saveContent = async (editorId: string, submissionId: number | undefined): Promise<void> => {
    const content = tinymce.get(editorId)?.getContent();
    if (content && submissionId) {
      try {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content");
        if (!csrfToken) {
          throw new Error("CSRF token tidak ditemukan.");
        }

        const response = await fetch("/your-laravel-route", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify({
            submission_id: submissionId,
            content,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          alert(`Konten berhasil disimpan: ${result.message}`);
        } else {
          const error = await response.json();
          console.error("Error:", error);
          alert(`Terjadi kesalahan: ${error.message || "Gagal menyimpan data"}`);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        alert("Terjadi kesalahan jaringan saat mencoba menyimpan data.");
      }
    } else {
      alert("Tidak ada konten yang disimpan atau submission ID tidak tersedia.");
    }
  };

  const handleApprove = (submissionId: number) => {
    setIsLoading(true);
    axios
      .post(route("direksi-submission-approve", submissionId))
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
      .post(route("direksi-submission-reject", submissionId))
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

  const getDayName = (dateString: any) => {
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const scoring_result = calculateTotalPoint(submission.scores);

  let notes = "";
  let recommendation = "";

  if (scoring_result > 60 && scoring_result < 100) {
    notes = "Dipertimbangkan untuk disetujui";
    recommendation = "disetujui";
  } else if (scoring_result <= 60) {
    notes = "Dipertimbangkan untuk ditambahkan mitigasi risiko";
    recommendation = "ditolak";
  } else {
    notes = "Skoring tidak valid";
    recommendation = "ditolak";
  }

  console.log({ scoring_result, notes, recommendation });

  return (
    <>
      <Show when={submission?.beyond_the_limit}>
        <div className="fixed top-20 w-[81%] z-[100]">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Peringatan</AlertTitle>
            <AlertDescription>
              Pengajuan Melebihi Batas Kewenangan Nilai Jaminan Rp. {textCurrency(submission?.guarantee_value)}
            </AlertDescription>
          </Alert>
        </div>
      </Show>
      <main className={"space-y-10 w-[800px] mx-auto mt-[50px]"}>
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
                  <span>Pengajuan sedang diproses</span>
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
                    <td className="p-2 font-semibold">SIUP / SIUJK</td>
                    <td className="p-2">: {submission?.principal?.siup_siujk}</td>
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
          </Show>
          <Show when={currentStep.name === "contract"}>
            <table className="table-fixed w-full border border-gray-300">
              <tbody>
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
                  <td className="p-2">: {data?.job_location}</td>
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
              <div className="flex justify-between w-full">
                <div className="w-full">
                  <table className="table-fixed border w-full border-gray-300">
                    <thead>
                      <tr className="border-b bg-gray-100">
                        <th className="p-2 font-semibold text-left w-1/2">Rasio</th>
                        <RenderList
                          of={submission?.principal?.ratios}
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
                          of={submission?.principal?.ratios}
                          render={(ratio: any) => {
                            return <td className="p-2 font-semibold text-center w-1/2">{ratio.current_assets}</td>;
                          }}
                        />
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-semibold text-left w-1/2">Utang Lancar</td>
                        <RenderList
                          of={submission?.principal?.ratios}
                          render={(ratio: any) => {
                            return <td className="p-2 font-semibold text-center w-1/2">{ratio.current_debt}</td>;
                          }}
                        />
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-semibold text-left w-1/2">Total Utang</td>
                        <RenderList
                          of={submission?.principal?.ratios}
                          render={(ratio: any) => {
                            return <td className="p-2 font-semibold text-center w-1/2">{ratio.total_debt}</td>;
                          }}
                        />
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-semibold text-left w-1/2">Total Aktiva</td>
                        <RenderList
                          of={submission?.principal?.ratios}
                          render={(ratio: any) => {
                            return <td className="p-2 font-semibold text-center w-1/2">{ratio.total_assets}</td>;
                          }}
                        />
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-semibold text-left w-1/2">Pendapatan</td>
                        <RenderList
                          of={submission?.principal?.ratios}
                          render={(ratio: any) => {
                            return <td className="p-2 font-semibold text-center w-1/2">{ratio.revenue}</td>;
                          }}
                        />
                      </tr>
                      <tr className="border-b">
                        <td className="p-2 font-semibold text-left w-1/2">Laba Bersih</td>
                        <RenderList
                          of={submission?.principal?.ratios}
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
                        of={submission?.principal?.ratios}
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
                    <td className="p-2 text-center">{calculateTotalPoint(submission?.scores)}</td>
                  </tr>
                  <tr>
                    <td
                      colSpan={4}
                      className={cn({
                        "p-2 text-center": true,
                        "bg-green-300":
                          submission?.scores?.[0]?.scoring?.min_point < calculateTotalPoint(submission?.scores),
                        "bg-red-300":
                          submission?.scores?.[0]?.scoring?.min_point >= calculateTotalPoint(submission?.scores),
                      })}>
                      <span className="pr-1">Disarankan Untuk</span>
                      {submission?.scores?.[0]?.scoring?.min_point < calculateTotalPoint(submission?.scores) ? (
                        <span className="text-green-800">
                          Disetujui Karena Nilai {calculateTotalPoint(submission?.scores)} Lebih Dari{" "}
                          {submission?.scores?.[0]?.scoring?.min_point}
                        </span>
                      ) : (
                        <span className="text-red-800">
                          Ditolak Karena
                          {" Nilai " +
                            calculateTotalPoint(submission?.scores) +
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
                  initialContent={replaceHasilAnalisaPlaceholders(templateHasilAnalisa, data)}
                />
                {/* <Button
                onClick={() => handleSave("hasil-analisis", submission.id)}
                className="mt-2 px-4 py-2 bg-blue-500 text-white">
                Simpan Hasil Analisis
                </Button> */}
              </div>

              {/* DOCUMENT FORMAT  */}
              <div>
                {submission?.document_format_guarantor.map((doc: any) => (
                  <div key={doc.id} style={{ marginBottom: "20px" }}>
                    <h3 className="text-lg font-semibold mb-4 mt-5">{doc.name}</h3>
                    <TinyMCEEditor
                      id={doc.name.replace(/\s+/g, "-").toLowerCase()}
                      initialContent={replacePlaceholders(doc.format_document, dataTemplate)}
                      onInit={(evt, editor) => (editorRefs.current[`editor-${doc.id}`] = editor)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Show>
          <Show
            when={
              submission?.status === SubmissionStatus.PROCESS &&
              !submission?.beyond_the_limit &&
              !submission?.approved_at &&
              !submission?.rejected_at
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
                      onClick={() => submission?.id && handleReject(submission?.id)}>
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
                      onClick={() => submission?.id && handleApprove(submission?.id)}>
                      Setujui
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </Show>
        </div>
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
