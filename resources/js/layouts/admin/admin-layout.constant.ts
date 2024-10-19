import { Archive, BookOpenCheck, Boxes, ChartColumn, ChartNoAxesGantt, Home, MapPinHouse, User } from "lucide-react";

export const adminRoute = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "#",
      route_name: "admin",
      href: route("admin.index"),
      icon: Home,
      isActive: true,
      items: [],
    },
    {
      title: "Kelola Perusahaan",
      url: "#",
      icon: User,
      isActive: true,
      items: [
        {
          title: "Daftar Cabang",
          route_name: "branch",
          href: route("branch.index"),
          url: "#",
        },
        {
          title: "Karyawan",
          route_name: "employee",
          href: route("employee.index"),
          url: "#",
        },
      ],
    },
    {
      title: "Kelola Pengajuan",
      url: "#",
      icon: Archive,
      items: [
        {
          title: "Daftar Pengajuan",
          route_name: "submission",
          href: route("submission.index"),
          url: "#",
        },
        {
          title: "Prasyarat Dokumen",
          route_name: "document",
          href: route("document.index"),
          url: "#",
        },
      ],
    },
    {
      title: "Kelola Wilayah",
      url: "#",
      icon: MapPinHouse,
      items: [
        {
          title: "Provinsi",
          route_name: "province",
          href: route("province.index"),
          url: "#",
        },
        {
          title: "Kabupaten",
          route_name: "regency",
          href: route("regency.index"),
          url: "#",
        },
        {
          title: "Kecamatan",
          route_name: "district",
          href: route("district.index"),
          url: "#",
        },
      ],
    },
    {
      title: "Kelola Produk",
      url: "#",
      icon: Boxes,
      items: [
        {
          title: "Jenis Produk",
          route_name: "product-types",
          href: route("product-types.index"),
          url: "#",
        },
        {
          title: "Produk",
          route_name: "products",
          href: route("products.index"),
          url: "#",
        },
      ],
    },
    {
      title: "Kelola Asuransi",
      url: "#",
      icon: BookOpenCheck,
      items: [
        {
          title: "Asuransi",
          route_name: "guarantor",
          href: route("guarantor.index"),
          url: "#",
        },
        {
          title: "Produk Asuransi",
          route_name: "product-guarantor",
          href: route("product-guarantor.index"),
          url: "#",
        },
        {
          title: "Blangko",
          route_name: "blank",
          href: route("blank.index"),
          url: "#",
        },
        {
          title: "Pembagian Blangko",
          route_name: "distribution-of-blank",
          href: route("distribution-of-blank.index"),
          url: "#",
        },
        {
          title: "Limit Pengajuan Kantor",
          route_name: "profile-limit",
          href: route("profile-limit.index"),
          url: "#",
        },
      ],
    },
    {
      title: "Kelola Skoring",
      url: "#",
      icon: ChartColumn,
      items: [
        {
          title: "Skoring",
          route_name: "scoring",
          href: route("scoring.index"),
          url: "#",
        },
        {
          title: "Kategori Pertanyaan",
          route_name: "scoring-question-category",
          href: route("scoring-question-category.index"),
          url: "#",
        },
        {
          title: "Pertanyaan",
          route_name: "scoring-question",
          href: route("scoring-question.index"),
          url: "#",
        },
      ],
    },
  ],
};
