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

interface EditScoringHeaderProps {
  title: string;
}

const EditScoringHeader: React.FC<EditScoringHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Tambah Skoring"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("scoring.index")}>Kelola Skoring</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Skoring</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title}</h1>
      </div>
    </>
  );
};

export default EditScoringHeader;
