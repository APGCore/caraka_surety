import { Archive, Home } from "lucide-react";

export const staffTeknikRoute = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      route_name: "staff-teknik",
      href: route("staff-teknik.index"),
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
          route_name: "staff-submission-create",
          href: route("staff-submission-create.submission"),
          url: "#",
        },
        {
          title: "Riwayat Pengajuan",
          route_name: "staff-submission-history",
          href: route("staff-submission-history.submission"),
          url: "#",
        },
      ],
    },
  ],
};
