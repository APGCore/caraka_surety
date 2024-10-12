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

interface EditScoringQuestionCategoryHeaderProps {
  title: string;
}

const EditScoringQuestionCategoryHeader: React.FC<EditScoringQuestionCategoryHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Edit Kategori Pertayaan Skoring"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("scoring-question-category.index")}>Kelola Kategori Pertanyaan</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Kategori Pertayaan Skoring</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title}</h1>
      </div>
    </>
  );
};

export default EditScoringQuestionCategoryHeader;
