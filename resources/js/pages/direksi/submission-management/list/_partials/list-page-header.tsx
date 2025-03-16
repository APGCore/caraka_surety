import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/_shadcn-ui/breadcrumb";
import { Head } from "@inertiajs/react";
import React from "react";

interface SubmissionListHeaderProps {
    title: string;
}

const SubmissionListHeader: React.FC<SubmissionListHeaderProps> = ({ title }) => {
    return (
        <>
            <Head title={title ?? "History Pengajuan"} />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={route("scoring.index")}>Kelola Pengajuan</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>List Pengajuan</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-3xl">{title ?? "List Pengajuan"}</h1>
            </div>
        </>
    );
};

export default SubmissionListHeader;
