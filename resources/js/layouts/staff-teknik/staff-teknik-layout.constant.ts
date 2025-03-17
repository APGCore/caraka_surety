import { IAppSideBarMenu } from "@/components/sidebar/app-sidebar/app-sidebar.type";
import { Archive, Home } from "lucide-react";

export const staffTeknikRoute: IAppSideBarMenu[] = [
    {
        title: "Dashboard",
        route_name: "staff-teknik",
        href: route("staff-teknik.index"),
        icon: Home,
        items: [],
    },
    {
        title: "Kelola Pengajuan",
        icon: Archive,
        items: [
            {
                title: "Buat Pengajuan",
                route_name: "staff-submission-create",
                href: route("staff-submission-create.submission"),
            },
            {
                title: "Riwayat Pengajuan",
                route_name: "staff-submission-history",
                href: route("staff-submission-history.submission"),
            },
        ],
    },
];
