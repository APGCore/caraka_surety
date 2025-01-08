import { Archive, Home } from "lucide-react";

export const staffOperasionalRoute = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      route_name: "staff-operasional",
      href: route("staff-operasional.index"),
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
          title: "Penerimaan Blanko",
          route_name: "staff-submission-create",
          href: route("staff-submission-create.submission"),
          url: "#",
        },
        {
          title: "Daftar Blanko",
          route_name: "staff-submission-history",
          href: route("staff-submission-history.submission"),
          url: "#",
        },
        {
          title: "Transfer Blanko",
          route_name: "staff-submission-history",
          href: route("staff-submission-history.submission"),
          url: "#",
        },
      ],
    },
  ],
};
