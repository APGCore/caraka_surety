import { IAppSideBarMenu } from "@/components/organisms/sidebar/app-sidebar/app-sidebar.type";
import { Home, Stamp } from "lucide-react";

export const staffOperasionalRoute: IAppSideBarMenu[] = [
  {
    title: "Dashboard",
    route_name: "staff-operasional.dashboard",
    href: route("staff-operasional.dashboard.index"),
    icon: Home,
    items: [],
  },
  {
    title: "Kelola Blangko",
    icon: Stamp,
    items: [
      {
        title: "Penerimaan Blangko",
        route_name: "staff-operasional.blank-management.blank",
        href: route("staff-operasional.blank-management.blank.index"),
      },
      {
        title: "Daftar Blangko",
        route_name: "staff-operasional.blank-management.distribution-of-blank",
        href: route("staff-operasional.blank-management.distribution-of-blank.index"),
      },
    ],
  },
];
