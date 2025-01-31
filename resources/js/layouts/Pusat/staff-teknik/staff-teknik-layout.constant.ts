import { IAppSideBarMenu } from "@/components/sidebar/app-sidebar/app-sidebar.type";
import { Archive, Home } from "lucide-react";

export const staffTeknikRoute: IAppSideBarMenu[] = [
  {
    title: "Dashboard",
    route_name: "staff-teknik.dashboard",
    href: route("staff-teknik.dashboard.index"),
    icon: Home,
    items: [],
  },
  {
    title: "Kelola Pengajuan",
    icon: Archive,
    items: [
      {
        title: "Buat Pengajuan",
        route_name: "staff-teknik-create",
        href: route("staff-teknik-create.submission"),
      },
      {
        title: "Riwayat Pengajuan",
        route_name: "staff-teknik-history",
        href: route("staff-teknik-history.submission"),
      },
    ],
  },
];
