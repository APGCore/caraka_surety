import { IAppSideBarMenu } from "@/components/organisms/SideBar/AppSideBar/AppSideBar.type";
import { Archive, Home, Stamp } from "lucide-react";

export const direksiRoute: IAppSideBarMenu[] = [
  {
    title: "Dashboard",
    route_name: "direksi",
    href: route("direksi.index"),
    icon: Home,
    items: [],
  },
  {
    title: "Kelola Blangko",
    icon: Stamp,
    items: [
      {
        title: "Penerimaan Blangko",
        route_name: "direksi.blank-management.blank",
        href: route("direksi.blank-management.blank.index"),
      },
    ],
  },
  {
    title: "Kelola Pengajuan",
    icon: Archive,
    items: [
      {
        title: "List Pengajuan",
        route_name: "direksi-submission-list",
        href: route("direksi-submission-list.submission"),
      },
      {
        title: "Riwayat Pengajuan",
        route_name: "direksi-submission-history",
        href: route("direksi-submission-history.submission"),
      },
    ],
  },
];
