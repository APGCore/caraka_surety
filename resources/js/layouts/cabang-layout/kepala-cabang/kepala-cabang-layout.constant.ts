import { IAppSideBarMenu } from "@/components/sidebar/app-sidebar/app-sidebar.type";
import { Archive, Home, Stamp } from "lucide-react";

export const kepalaCabangRoute: IAppSideBarMenu[] = [
  {
    title: "Dashboard",
    route_name: "kepala-cabang",
    href: route("kepala-cabang.index"),
    icon: Home,
    items: [],
  },
  {
    title: "Kelola Blangko",
    icon: Stamp,
    items: [
      {
        title: "Penerimaan Blangko",
        route_name: "kepala-cabang-blank-management.blank",
        href: route("kepala-cabang-blank-management.blank.index"),
      },
    ],
  },
  {
    title: "Kelola Pengajuan",
    icon: Archive,
    items: [
      {
        title: "List Pengajuan Masuk",
        route_name: "kepala-cabang-submission.list",
        href: route("kepala-cabang-submission.list.index"),
      },
      {
        title: "List Hasil Pengajuan",
        route_name: "kepala-cabang-submission.history",
        href: route("kepala-cabang-submission.history.index"),
      },
    ],
  },
];
