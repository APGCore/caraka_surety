import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Head } from "@inertiajs/react";
import React from "react";

interface SubmissionCreateHeaderProps {
  title: string;
}

const SubmissionCreateHeader: React.FC<SubmissionCreateHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Buat Pengajuan"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("scoring.index")}>Kelola Pengajuan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Buat Pengajuan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Buat Pengajuan"}</h1>
      </div>
    </>
  );
};

export default SubmissionCreateHeader;
