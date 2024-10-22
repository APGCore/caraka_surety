import { Archive, Home } from "lucide-react";

export const staffCabangRoute = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      route_name: "staff-cabang",
      href: route("staff-cabang.index"),
      icon: Home,
      isActive: true,
      items: [],
    },
    {
      title: "Kelola Pengajuan",
      url: "#",
      icon: Archive,
      items: [
        {
          title: "Buat Pengajuan",
          route_name: "staff-cabang-submission-create",
          href: route("staff-cabang-submission-create.submission"),
          url: "#",
        },
        {
          title: "Riwayat Pengajuan",
          route_name: "staff-cabang-submission-history",
          href: route("staff-cabang-submission-history.submission"),
          url: "#",
        },
        {
          title: "Draft Dokumen Pengajuan",
          route_name: "staff-cabang-submission-document-draft",
          href: route("staff-cabang-submission-document-draft.submission"),
          url: "#",
        },
      ],
    },
  ],
};
