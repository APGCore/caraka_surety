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

interface CreateScoringQuestionHeaderProps {
  title: string;
}

const CreateScoringQuestionHeader: React.FC<CreateScoringQuestionHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Tambah Pertanyaan Skoring"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("scoring-question.index")}>Kelola Pertanyaan Skoring</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Pertanyaan Skoring</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title}</h1>
      </div>
    </>
  );
};

export default CreateScoringQuestionHeader;
