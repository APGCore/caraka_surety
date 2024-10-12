import { generateUUID } from "@/lib/generate-uuid";
import {
  Archive,
  Building,
  ChartNoAxesGantt,
  CircleDollarSign,
  FileBoxIcon,
  Home,
  Landmark,
  MapPinHouse,
  PackageSearch,
  SquareChartGantt,
  User,
} from "lucide-react";

export const adminLinks = [
  {
    title: "Dashboard",
    route: [
      {
        id: generateUUID(),
        name: "Dashboard",
        route_name: "admin.index",
        href: route("admin.index"),
        Icon: Home,
        children: [],
      },
    ],
  },

  {
    title: "Kelola Perusahaan",
    route: [
      {
        id: generateUUID(),
        name: "Daftar Cabang",
        route_name: "branch.index",
        href: route("branch.index"),
        Icon: User,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Karyawan",
        route_name: "employee.index",
        href: route("employee.index"),
        Icon: User,
        children: [],
      },
    ],
  },

  {
    title: "Kelola Pengajuan",
    route: [
      {
        id: generateUUID(),
        name: "Daftar Pengajuan",
        route_name: "submission.index",
        href: route("submission.index"),
        Icon: Archive,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Prasyarat Dokumen",
        route_name: "document.index",
        href: route("document.index"),
        Icon: FileBoxIcon,
        children: [],
      },
    ],
  },

  //   {
  //     title: "Kelola Prasyarat Dokumen",
  //     route: [
  //       {
  //         id: generateUUID(),
  //         name: "Dokumen Umum",
  //         route_name: "document.index",
  //         href: route("document.index"),
  //         Icon: FileBoxIcon,
  //         children: [],
  //       },
  //     ],
  //   },

  {
    title: "Wilayah",
    route: [
      {
        id: generateUUID(),
        name: "Provinsi",
        route_name: "province.index",
        href: route("province.index"),
        Icon: MapPinHouse,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Kabupaten",
        route_name: "regency.index",
        href: route("regency.index"),
        Icon: MapPinHouse,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Kecamatan",
        route_name: "district.index",
        href: route("district.index"),
        Icon: MapPinHouse,
        children: [],
      },
      // {
      //   id: generateUUID(),
      //   name: "Desa",
      //   route_name: "villages.index",
      //   href: route("villages.index"),
      //   Icon: MapPinHouse,
      //   children: [],
      // },
    ],
  },
  {
    title: "Kelola Produk",
    route: [
      {
        id: generateUUID(),
        name: "Jenis Produk",
        route_name: "product-types.index",
        href: route("product-types.index"),
        Icon: ChartNoAxesGantt,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Produk",
        route_name: "products.index",
        href: route("products.index"),
        Icon: SquareChartGantt,
        children: [],
      },
    ],
  },
  {
    title: "Kelola Penjamin",
    route: [
      {
        id: generateUUID(),
        name: "Penjamin",
        route_name: "guarantor.index",
        href: route("guarantor.index"),
        Icon: CircleDollarSign,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Produk Penjamin",
        route_name: "product-guarantor.index",
        href: route("product-guarantor.index"),
        Icon: PackageSearch,
        children: [],
      },
    ],
  },
  {
    title: "Kelola Pihak Terkait",
    route: [
      {
        id: generateUUID(),
        name: "Obligee",
        route_name: "obligee.index",
        href: route("obligee.index"),
        Icon: Building,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Bank",
        route_name: "bank.index",
        href: route("bank.index"),
        Icon: Landmark,
        children: [],
      },
    ],
  },
  {
    title: "Kelola Skoring",
    route: [
      {
        id: generateUUID(),
        name: "Skoring",
        route_name: "scoring.index",
        href: route("scoring.index"),
        Icon: ChartNoAxesGantt,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Kategori Pertanyaan",
        route_name: "scoring-question-category.index",
        href: route("scoring-question-category.index"),
        Icon: ChartNoAxesGantt,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Pertanyaan",
        route_name: "scoring-question.index",
        href: route("scoring-question.index"),
        Icon: ChartNoAxesGantt,
        children: [],
      },
    ],
  },
];
