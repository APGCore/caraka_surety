import { IAppSideBarMenu } from "@/components/sidebar/app-sidebar/app-sidebar.type";
import { Archive, Home } from "lucide-react";

export const marketingPartnerRoute: IAppSideBarMenu[] = [
  {
    title: "Dashboard",
    route_name: "marketing-partner",
    href: route("marketing-partner.index"),
    icon: Home,
    items: [],
  },

  {
    title: "Kelola Pengajuan",
    icon: Archive,
    items: [
      {
        title: "Buat Pengajuan",
        route_name: "marketing-partner-submission.create",
        href: route("marketing-partner-submission.create.index"),
      },
      {
        title: "Riwayat Pengajuan",
        route_name: "marketing-partner-submission.history",
        href: route("marketing-partner-submission.history.index"),
      },
      // {
      //   title: "Draft Dokumen Pengajuan",
      //   route_name: "staff-submission-document-draft",
      //   href: route("staff-submission-document-draft.submission"),
      //
      // },
    ],
  },
];
