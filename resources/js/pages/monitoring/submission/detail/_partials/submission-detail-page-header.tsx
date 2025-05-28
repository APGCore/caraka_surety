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

interface SubmissionDetailHeaderProps {
  title: string;
}

const SubmissionDetailHeader: React.FC<SubmissionDetailHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Detail Pengajuan"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("monitoring.submission.index")}>Pengajuan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Detail Pengajuan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Buat Pengajuan"}</h1>
      </div>
    </>
  );
};

export default SubmissionDetailHeader;
