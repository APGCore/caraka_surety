import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { BlankUsageUtils } from "@/pages/report/blanks-usage/_partials/blank-usage.utils";
import { Head } from "@inertiajs/react";
import React from "react";

interface BlankUsageHeaderProps {
  title: string;
}

const BlankUsageHeader: React.FC<BlankUsageHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Invoice"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route(BlankUsageUtils.link.index)}>Laporan Invoice</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Invoice"}</h1>
      </div>
    </>
  );
};

export default BlankUsageHeader;
