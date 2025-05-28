import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import { Head } from "@inertiajs/react";
import React from "react";

interface SubmissionHistoryHeaderProps {
  title: string;
}

const SubmissionHeader: React.FC<SubmissionHistoryHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Pengajuan"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Pengajuan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Pengajuan"}</h1>
      </div>
    </>
  );
};

export default SubmissionHeader;
