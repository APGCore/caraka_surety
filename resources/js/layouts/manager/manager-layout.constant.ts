import { Archive, Home } from "lucide-react";

export const managerRoute = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      route_name: "manager",
      href: route("manager.index"),
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
          route_name: "manager-submission-list",
          href: route("manager-submission-list.submission"),
          url: "#",
        },
        {
          title: "Riwayat Pengajuan",
          route_name: "manager-submission-history",
          href: route("manager-submission-history.submission"),
          url: "#",
        },
        // {
        //   title: "Draft Dokumen Pengajuan",
        //   route_name: "manager-submission-document-draft",
        //   href: route("manager-submission-document-draft.submission"),
        //   url: "#",
        // },
      ],
    },
  ],
};
