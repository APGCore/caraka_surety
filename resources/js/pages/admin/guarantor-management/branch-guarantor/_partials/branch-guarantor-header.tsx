import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Head } from "@inertiajs/react";
import React from "react";

interface GuarantorHeaderProps {
  title: string;
  route: string;
}

const BranchGuarantorHeader: React.FC<GuarantorHeaderProps> = ({ title, route }) => {
  return (
    <>
      <Head title={title ?? "Cabang Asuransi"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route}>Kelola {title ?? "Cabang Asuransi"}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Cabang Asuransi"}</h1>
      </div>
    </>
  );
};

export default BranchGuarantorHeader;
