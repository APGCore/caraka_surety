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

interface SubmissionDocumentDraftHeaderProps {
  title: string;
}

const SubmissionDocumentDraftHeader: React.FC<SubmissionDocumentDraftHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Draft Dokumen Pengajuan"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("scoring.index")}>Kelola Pengajuan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Draft Dokumen Pengajuan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Draft Dokumen Pengajuan"}</h1>
      </div>
    </>
  );
};

export default SubmissionDocumentDraftHeader;
