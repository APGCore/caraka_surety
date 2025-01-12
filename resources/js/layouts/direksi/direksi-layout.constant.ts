import { Archive, Home, Stamp } from "lucide-react";

export const direksiRoute = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      route_name: "direksi",
      href: route("direksi.index"),
      icon: Home,
      isActive: true,
      items: [],
    },
    {
      title: "Kelola Blangko",
      url: "#",
      icon: Stamp,
      items: [
        {
          title: "Penerimaan Blangko",
          route_name: "direksi.blank-management.blank",
          href: route("direksi.blank-management.blank.index"),
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
          title: "List Pengajuan",
          route_name: "direksi-submission-list",
          href: route("direksi-submission-list.submission"),
          url: "#",
        },
        {
          title: "Riwayat Pengajuan",
          route_name: "direksi-submission-history",
          href: route("direksi-submission-history.submission"),
          url: "#",
        },
        // {
        //   title: "Draft Dokumen Pengajuan",
        //   route_name: "direksi-submission-document-draft",
        //   href: route("direksi-submission-document-draft.submission"),
        //   url: "#",
        // },
      ],
    },
  ],
};
