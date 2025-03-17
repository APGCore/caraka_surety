import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { GuarantorProductTypeRateUtils } from "@/pages/admin/guarantor-management/guarantor-product-type-limit/guarantor-product-type-rate.utils";
import { Head } from "@inertiajs/react";
import React from "react";

interface GuarantorProductTypeRateHeaderProps {
    title: string;
    guarantor: any;
}

const GuarantorProductTypeRateHeader: React.FC<GuarantorProductTypeRateHeaderProps> = ({ title, guarantor }) => {
    return (
        <>
            <Head title={title ?? "Batas Kewenangan Nilai Jaminan Asuransi"} />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={route(GuarantorProductTypeRateUtils.link.index, guarantor?.id)}>
                            Kelola Batas Kewenangan Nilai Jaminan Asuransi
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-3xl">
                    {title ?? "Batas Kewenangan Nilai Jaminan Asuransi"} {guarantor?.name}
                </h1>
            </div>
        </>
    );
};

export default GuarantorProductTypeRateHeader;
