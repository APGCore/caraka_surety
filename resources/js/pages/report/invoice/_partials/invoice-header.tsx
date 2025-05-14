import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { InvoiceUtils } from "@/pages/report/invoice/_partials/invoice.utils";
import { Head } from "@inertiajs/react";
import React from "react";

interface InvoiceHeaderProps {
  title: string;
  url: string;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ title, url }) => {
  return (
    <>
      <Head title={title ?? "Invoice"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={url}>{title ?? "Invoice"}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Invoice"}</h1>
      </div>
    </>
  );
};

export default InvoiceHeader;
