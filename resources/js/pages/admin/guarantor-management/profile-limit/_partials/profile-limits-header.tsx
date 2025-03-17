import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { ProfileLimitsUtils } from "@/pages/admin/guarantor-management/profile-limit/profile-limits.utils";
import { Head } from "@inertiajs/react";
import React from "react";

interface ProfileLimitsHeaderProps {
    title: string;
}

const ProfileLimitsHeader: React.FC<ProfileLimitsHeaderProps> = ({ title }) => {
    return (
        <>
            <Head title={title ?? "Batas Kewenangan Nilai Jaminan Kantor"} />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={route(ProfileLimitsUtils.link.index)}>
                            Kelola Batas Kewenangan Nilai Jaminan Kantor
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-3xl">
                    {title ?? "Batas Kewenangan Nilai Jaminan Kantor"}
                </h1>
            </div>
        </>
    );
};

export default ProfileLimitsHeader;
