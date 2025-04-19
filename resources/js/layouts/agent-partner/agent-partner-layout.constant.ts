import { IAppSideBarMenu } from "@/components/sidebar/app-sidebar/app-sidebar.type";
import { Archive, Home } from "lucide-react";

export const agentPartnerRoute: IAppSideBarMenu[] = [
  {
    title: "Dashboard",
    route_name: "agent-partner",
    href: route("agent-partner.index"),
    icon: Home,
    items: [],
  },

  {
    title: "Kelola Pengajuan",
    icon: Archive,
    items: [
      {
        title: "Buat Pengajuan",
        route_name: "agent-partner-submission.create",
        href: route("agent-partner-submission.create.index"),
      },
      {
        title: "Riwayat Pengajuan",
        route_name: "agent-partner-submission.history",
        href: route("agent-partner-submission.history.index"),
      },
    ],
  },
];
