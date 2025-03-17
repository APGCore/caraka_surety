import { IAppSideBarMenu } from "@/components/sidebar/app-sidebar/app-sidebar.type";
import { Archive, Home, Stamp } from "lucide-react";

export const kepalaAgentPartnerRoute: IAppSideBarMenu[] = [
    {
        title: "Dashboard",
        route_name: "kepala-agent-partner",
        href: route("kepala-agent-partner.index"),
        icon: Home,
    },
    {
        title: "Kelola Blangko",
        icon: Stamp,
        items: [
            {
                title: "Penerimaan Blangko",
                route_name: "kepala-agent-partner-blank-management.blank",
                href: route("kepala-agent-partner-blank-management.blank.index"),
            },
        ],
    },
    {
        title: "Kelola Pengajuan",
        icon: Archive,
        items: [
            {
                title: "List Pengajuan Masuk",
                route_name: "kepala-agent-partner-submission.list",
                href: route("kepala-agent-partner-submission.list.index"),
            },
            {
                title: "List Hasil Pengajuan",
                route_name: "kepala-agent-partner-submission.history",
                href: route("kepala-agent-partner-submission.history.index"),
            },
        ],
    },
];
