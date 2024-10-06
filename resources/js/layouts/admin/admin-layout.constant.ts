import { generateUUID } from "@/lib/generate-uuid";
import { Archive, File, FileBoxIcon, Home, MapPinHouse, Shield, User } from "lucide-react";

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
        route_name: "karyawan.index",
        href: "karyawan",
        Icon: User,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Akses Aplikasi",
        route_name: "manajemen-akses",
        href: "manajemen-akses",
        Icon: Shield,
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
    ],
  },

  {
    title: "Kelola Dokumen",
    route: [
      {
        id: generateUUID(),
        name: "Dokumen Umum",
        route_name: "dokumen_umum",
        href: "dokumen_umum",
        Icon: FileBoxIcon,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Dokumen Khusus",
        route_name: "dokumen_khusus",
        href: "dokumen_khusus",
        Icon: File,
        children: [],
      },
    ],
  },

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
        name: "Produk",
        route_name: "products.index",
        href: route("products.index"),
        Icon: User,
        children: [],
      },
      {
        id: generateUUID(),
        name: "Jenis Produk",
        route_name: "product-types.index",
        href: route("product-types.index"),
        Icon: User,
        children: [],
      },
    ],
  },
];
