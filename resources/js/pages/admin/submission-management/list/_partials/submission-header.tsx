import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Head } from "@inertiajs/react";
import React from "react";
import { SubmissionUtils } from "./submission.utils";

interface SubmissionHeaderProps {
  title: string;
}

const SubmissionHeader: React.FC<SubmissionHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Daftar Pengajuan"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route(SubmissionUtils.link.index)}>{title ?? "Daftar Pengajuan"}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Daftar Pengajuan"}</h1>
      </div>
    </>
  );
};

export default SubmissionHeader;
