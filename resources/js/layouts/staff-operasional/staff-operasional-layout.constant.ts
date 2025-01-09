import { Home, Stamp } from "lucide-react";

export const staffOperasionalRoute = {
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      route_name: "staff-operasional.dashboard",
      href: route("staff-operasional.dashboard.index"),
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
          route_name: "staff-operasional.blank-management.blank",
          href: route("staff-operasional.blank-management.blank.index"),
          url: "#",
        },
        {
          title: "Daftar Blangko",
          route_name: "staff-operasional.blank-management.distribution-of-blank",
          href: route("staff-operasional.blank-management.distribution-of-blank.index"),
          url: "#",
        },
      ],
    },
  ],
};
