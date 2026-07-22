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

interface PrincipalDetailHeaderProps {
  title: string;
}

const PrincipalDetailHeader: React.FC<PrincipalDetailHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Detail Principal"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("monitoring.principal.index")}>Monitoring Principal</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail Principal</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Detail Principal"}</h1>
      </div>
    </>
  );
};

export default PrincipalDetailHeader;
