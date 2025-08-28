import { IAppSideBarMenu } from "@/components/sidebar/app-sidebar/app-sidebar.type";
import { Archive, Home, LibraryBig, MonitorCheck } from "lucide-react";

export const managerRoute: IAppSideBarMenu[] = [
  {
    title: "Dashboard",
    route_name: "manager",
    href: route("manager.index"),
    icon: Home,
    items: [],
  },
  {
    title: "Kelola Pengajuan",
    icon: Archive,
    items: [
      {
        title: "List Pengajuan Masuk",
        route_name: "manager-submission-list",
        href: route("manager-submission-list.submission"),
      },
      {
        title: "List Hasil Pengajuan",
        route_name: "manager-submission-history",
        href: route("manager-submission-history.submission"),
      },
    ],
  },
  {
    title: "Monitoring",
    icon: MonitorCheck,
    items: [
      {
        title: "Pengajuan",
        route_name: "monitoring.submission",
        href: route("monitoring.submission.index"),
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
  },
];
