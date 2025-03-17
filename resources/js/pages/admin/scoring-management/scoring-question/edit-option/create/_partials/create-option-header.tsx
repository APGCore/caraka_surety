import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/_shadcn-ui/breadcrumb";
import { Button } from "@/components/_shadcn-ui/button";
import { Head, Link } from "@inertiajs/react";
import React from "react";

interface CreateScoringQuestionOptionEditHeaderProps {
  title: string;
  selectedScoringQuestion: any;
  scoringOption: any;
}

const CreateScoringQuestionOptionEditHeader: React.FC<CreateScoringQuestionOptionEditHeaderProps> = ({
  title,
  selectedScoringQuestion,
  scoringOption,
}) => {
  return (
    <>
      <Head title={title ?? "Edit Pertayaan Skoring"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("scoring-question.index")}>Kelola Pertanyaan Skoring</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              href={route("scoring-question.edit-options", {
                scoringQuestion: selectedScoringQuestion?.id,
              })}>
              Pilihan Pertayaan Skoring
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Pilihan Pertayaan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title}</h1>
      </div>
    </>
  );
};

export default CreateScoringQuestionOptionEditHeader;
