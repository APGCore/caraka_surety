import { IAppSideBarMenu } from "@/components/sidebar/app-sidebar/app-sidebar.type";
import { Home, LibraryBig, MonitorCheck } from "lucide-react";

export const keuanganRoute: IAppSideBarMenu[] = [
  {
    title: "Dashboard",
    route_name: "keuangan",
    href: route("keuangan.index"),
    icon: Home,
    items: [],
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
      {
        title: "Principal",
        route_name: "monitoring.principal",
        href: route("monitoring.principal.index"),
      },
    ],
  },
  {
    title: "Laporan",
    icon: LibraryBig,
    items: [
      {
        title: "Invoice",
        route_name: "report.invoice",
        href: route("report.invoice.index"),
      },
      {
        title: "Produksi",
        route_name: "report.production",
        href: route("report.production.index"),
      },
    ],
  },
];
