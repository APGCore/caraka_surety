import { Archive, Home } from "lucide-react";

export const kepalaCabangRoute = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      route_name: "staff",
      href: route("staff.index"),
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
          title: "List Pengajuan",
          route_name: "kepala-cabang-submission-list",
          href: route("kepala-cabang-submission-list.submission"),
          url: "#",
        },
        {
          title: "Riwayat Pengajuan",
          route_name: "kepala-cabang-submission-history",
          href: route("kepala-cabang-submission-history.submission"),
          url: "#",
        },
        {
          title: "Draft Dokumen Pengajuan",
          route_name: "kepala-cabang-submission-document-draft",
          href: route("kepala-cabang-submission-document-draft.submission"),
          url: "#",
        },
      ],
    },
  ],
};
