import { IAppSideBarMenu } from "@/components/sidebar/app-sidebar/app-sidebar.type";
import { Currency, DollarSign, Home, LibraryBig } from "lucide-react";

export const keuanganRoute: IAppSideBarMenu[] = [
  {
    title: "Dashboard",
    route_name: "keuangan",
    href: route("keuangan.index"),
    icon: Home,
    items: [],
  },
  {
    title: "Kelola Tarif",
    icon: DollarSign,
    items: [
      {
        title: "Tarif Asuransi (Modal)",
        route_name: "guarantor-rate",
        href: route("guarantor-rate.index"),
      },
      {
        title: "Tarif Unit Bisnis (Jual)",
        route_name: "office-rate",
        href: route("office-rate.index"),
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
    ],
  },
];
