import { IAppSideBarMenu } from "@/components/organisms/SideBar/AppSideBar/AppSideBar.type";
import {
  Archive,
  BookOpenCheck,
  Boxes,
  Building,
  ChartColumn,
  Home,
  Infinity,
  LibraryBig,
  MapPinHouse,
  Stamp,
  User,
} from "lucide-react";

export const adminRoute: IAppSideBarMenu[] = [
  {
    title: "Dashboard",
    route_name: "admin",
    href: route("admin.index"),
    icon: Home,
    items: [],
  },
  {
    title: "Kelola Asuransi",
    icon: BookOpenCheck,
    items: [
      {
        title: "Asuransi",
        route_name: "guarantor",
        href: route("guarantor.index"),
      },
      {
        title: "Produk Asuransi",
        route_name: "product-guarantor",
        href: route("product-guarantor.index"),
      },
      {
        title: "Tarif Asuransi",
        route_name: "guarantor-rate",
        href: route("guarantor-rate.index"),
      },
    ],
  },
  {
    title: "Unit Bisnis",
    icon: User,
    items: [
      {
        title: "Cabang",
        route_name: "branch",
        href: route("branch.index"),
      },
      {
        title: "Mitra Pemasaran",
        route_name: "branch-mitra-pemasaran",
        href: route("branch-mitra-pemasaran.index"),
      },
      {
        title: "Mitra Agen",
        route_name: "branch-mitra-agen",
        href: route("branch-mitra-agen.index"),
      },
      {
        title: "Pengguna",
        route_name: "employee",
        href: route("employee.index"),
      },
      {
        title: "Tarif Unit Bisnis",
        route_name: "office-rate",
        href: route("office-rate.index"),
      },
    ],
  },
  {
    title: "Kelola Blangko",
    icon: Stamp,
    items: [
      {
        title: "Penerimaan Blangko",
        route_name: "blank-management.blank",
        href: route("blank-management.blank.index"),
      },
      {
        title: "Daftar Blangko",
        route_name: "blank-management.distribution-of-blank",
        href: route("blank-management.distribution-of-blank.index"),
      },
    ],
  },
  {
    title: "Kelola Wilayah",
    icon: MapPinHouse,
    items: [
      {
        title: "Provinsi",
        route_name: "province",
        href: route("province.index"),
      },
      {
        title: "Kabupaten",
        route_name: "regency",
        href: route("regency.index"),
      },
      {
        title: "Kecamatan",
        route_name: "district",
        href: route("district.index"),
      },
    ],
  },
  {
    title: "Kelola Produk",
    icon: Boxes,
    items: [
      {
        title: "Produk",
        route_name: "products",
        href: route("products.index"),
      },
      {
        title: "Jenis Produk",
        route_name: "product-types",
        href: route("product-types.index"),
      },
    ],
  },

  {
    title: "Kelola Batas Nilai Jaminan",
    icon: Infinity,
    items: [
      {
        title: "Produk Asuransi",
        route_name: "guarantor-product-type-limit",
        href: route("guarantor-product-type-limit.index"),
      },
      {
        title: "Unit Kantor",
        route_name: "profile-limit",
        href: route("profile-limit.index"),
      },
      {
        title: "Pengguna",
        route_name: "employee-limit",
        href: route("employee-limit.index"),
      },
    ],
  },
  {
    title: "Kelola Pihak Terkait",
    icon: Building,
    items: [
      {
        title: "Obligee",
        route_name: "obligee",
        href: route("obligee.index"),
      },
      {
        title: "Bank",
        route_name: "bank",
        href: route("bank.index"),
      },
    ],
  },
  {
    title: "Kelola Skoring",
    icon: ChartColumn,
    items: [
      {
        title: "Skoring",
        route_name: "scoring",
        href: route("scoring.index"),
      },
      {
        title: "Kategori Pertanyaan",
        route_name: "scoring-question-category",
        href: route("scoring-question-category.index"),
      },
      {
        title: "Pertanyaan",
        route_name: "scoring-question",
        href: route("scoring-question.index"),
      },
    ],
  },
  {
    title: "Kelola Pengajuan",
    icon: Archive,
    items: [
      {
        title: "Prasyarat Dokumen",
        route_name: "document",
        href: route("document.index"),
      },
      {
        title: "Sumber Dana",
        route_name: "source-of-funds",
        href: route("source-of-funds.index"),
      },
      {
        title: "Daftar Pengajuan",
        route_name: "submission",
        href: route("submission.index"),
      },
      {
        title: "Format Dokumen",
        route_name: "document-format",
        href: route("document-format.index"),
      },
    ],
  },
  {
    title: "Laporan",
    icon: LibraryBig,
    items: [
      {
        title: "Invoice",
        route_name: "report.invoice",
        href: route("report.invoice.index"),
      },
      {
        title: "Produksi",
        route_name: "report.production",
        href: route("report.production.index"),
      },
      {
        title: "Penggunaan Blangko",
        route_name: "report.blank-usage",
        href: route("report.blank-usage.index"),
      },
    ],
  },
];
