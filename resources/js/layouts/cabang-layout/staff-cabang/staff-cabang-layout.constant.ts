import { IAppSideBarMenu } from "@/components/sidebar/app-sidebar/app-sidebar.type";
import {Archive, Home, LibraryBig} from "lucide-react";

export const staffCabangRoute: IAppSideBarMenu[] = [
  {
    title: "Dashboard",
    route_name: "staff",
    href: route("staff.index"),
    icon: Home,
    items: [],
  },
  {
    title: "Kelola Pengajuan",
    icon: Archive,
    items: [
      {
        title: "Buat Pengajuan",
        route_name: "staff-submission-create",
        href: route("staff-submission-create.submission"),
      },
      {
        title: "List Pengajuan",
        route_name: "staff-submission-history",
        href: route("staff-submission-history.submission"),
      },
    ],
  },
  {
    title: "Laporan",
    icon: LibraryBig,
    items: [
      {
        title: "Produksi",
        route_name: "report.production",
        href: route("report.production.index"),
      },
    ],
  }
];
