import { IAppSideBarMenu } from "@/components/organisms/sidebar/app-sidebar/app-sidebar.type";
import { Archive, Home } from "lucide-react";

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
];
