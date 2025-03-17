import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { OfficeRateUtils } from "@/pages/admin/office-management/office-rate/office-rate.utils";
import { Head } from "@inertiajs/react";
import React from "react";

interface OfficeRateHeaderProps {
    title: string;
    profile?: any;
    guarantor?: any;
}

const OfficeRateHeader: React.FC<OfficeRateHeaderProps> = ({ title, profile, guarantor }) => {
    return (
        <>
            <Head title={title ?? "Tarif Unit Bisnis"} />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            href={route(OfficeRateUtils.link.index, {
                                profile_id: profile?.id,
                                guarantor_id: guarantor?.id,
                            })}>
                            Kelola {title ?? "Tarif Unit Bisnis"}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-3xl">
                    {title ?? "Tarif Unit Bisnis"} {profile?.name} {profile && "untuk"} {guarantor?.name}
                </h1>
            </div>
        </>
    );
};

export default OfficeRateHeader;
