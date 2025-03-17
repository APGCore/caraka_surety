import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { GuarantorRateUtils } from "@/pages/admin/guarantor-management/guarantor-rate/guarantor-rate.utils";
import { Head } from "@inertiajs/react";
import React from "react";

interface GuarantorRateHeaderProps {
    title: string;
    guarantor?: any;
}

const GuarantorRateHeader: React.FC<GuarantorRateHeaderProps> = ({ title, guarantor }) => {
    return (
        <>
            <Head title={title ?? "Tarif Asuransi"} />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={route(GuarantorRateUtils.link.index, { guarantor_id: guarantor?.id })}>
                            Kelola {title ?? "Tarif Asuransi"}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-3xl">
                    {title ?? "Tarif Asuransi"} {guarantor?.name}
                </h1>
            </div>
        </>
    );
};

export default GuarantorRateHeader;
