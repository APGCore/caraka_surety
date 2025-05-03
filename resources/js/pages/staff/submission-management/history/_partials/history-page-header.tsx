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

interface SubmissionHistoryHeaderProps {
  title: string;
}

const SubmissionHistoryHeader: React.FC<SubmissionHistoryHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={"List Pengajuan"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>List Pengajuan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">List Pengajuan</h1>
      </div>
    </>
  );
};

export default SubmissionHistoryHeader;
