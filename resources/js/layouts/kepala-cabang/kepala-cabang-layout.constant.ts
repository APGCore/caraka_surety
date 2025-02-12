import { IAppSideBarMenu } from "@/components/sidebar/app-sidebar/app-sidebar.type";
import { Archive, Home } from "lucide-react";

export const kepalaCabangRoute: IAppSideBarMenu[] = [
    {
        title: "Dashboard",
        route_name: "kepala-cabang",
        href: route("kepala-cabang.index"),
        icon: Home,
        items: [],
    },

    {
        title: "Kelola Pengajuan",
        icon: Archive,
        items: [
            {
                title: "List Pengajuan Masuk",
                route_name: "kepala-cabang-submission-list",
                href: route("kepala-cabang-submission-list.submission"),
            },
            {
                title: "List Hasil Pengajuan",
                route_name: "kepala-cabang-submission-history",
                href: route("kepala-cabang-submission-history.submission"),
            },
        ],
    },
];
