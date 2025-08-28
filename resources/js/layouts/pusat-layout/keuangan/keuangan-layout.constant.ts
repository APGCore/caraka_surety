import { IAppSideBarMenu } from "@/components/sidebar/app-sidebar/app-sidebar.type";
import { Home, LibraryBig } from "lucide-react";

export const keuanganRoute: IAppSideBarMenu[] = [
  {
    title: "Dashboard",
    route_name: "keuangan",
    href: route("keuangan.index"),
    icon: Home,
    items: [],
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
