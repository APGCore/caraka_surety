import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { GuarantorUtils } from "@/pages/admin/guarantor-management/guarantor/guarantor.utils";
import { Head } from "@inertiajs/react";
import React from "react";

interface GuarantorHeaderProps {
  title: string;
}

const GuarantorHeader: React.FC<GuarantorHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Asuransi"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route(GuarantorUtils.link.index)}>Kelola {title ?? "Asuransi"}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Asuransi"}</h1>
      </div>
    </>
  );
};

export default GuarantorHeader;
