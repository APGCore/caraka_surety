import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Button } from "@/components/_shadcn-ui/button";
import { DocumentFormatUtils } from "@/pages/admin/documents/format/document-format.utils";
import { Head, Link } from "@inertiajs/react";
import React from "react";

interface ProfileLimitsHeaderProps {
  title: string;
}

const DocumentFormatHeader: React.FC<ProfileLimitsHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Format Dokumen"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route(DocumentFormatUtils.link.index)}>Kelola Format Dokumen</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Format Dokumen"}</h1>
        <Button asChild>
          <Link href={route(DocumentFormatUtils.link.create)}>Tambah</Link>
        </Button>
      </div>
    </>
  );
};

export default DocumentFormatHeader;
