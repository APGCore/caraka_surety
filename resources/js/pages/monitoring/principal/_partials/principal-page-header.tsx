import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import { Head } from "@inertiajs/react";
import React from "react";

interface PrincipalHeaderProps {
  title: string;
}

const PrincipalHeader: React.FC<PrincipalHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Monitoring Principal"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Monitoring Principal</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Monitoring Principal"}</h1>
      </div>
    </>
  );
};

export default PrincipalHeader;
