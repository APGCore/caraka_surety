import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Head } from "@inertiajs/react";
import React from "react";
import FormSourceOfFunds from "./form-source-of-funds";

interface SourceOfFundsHeaderProps {
  title: string;
}

const SourceOfFundsHeader: React.FC<SourceOfFundsHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Sumber Dana"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("scoring.index")}>Kelola Sumber Dana</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Sumber Dana"}</h1>
        <FormSourceOfFunds />
      </div>
    </>
  );
};

export default SourceOfFundsHeader;
