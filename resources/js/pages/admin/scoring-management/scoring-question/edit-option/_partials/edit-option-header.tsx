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

interface EditScoringQuestionOptionHeaderProps {
  title: string;
  selectedScoringQuestion: any;
}

const EditScoringQuestionOptionHeader: React.FC<EditScoringQuestionOptionHeaderProps> = ({
  title,
  selectedScoringQuestion,
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
            <BreadcrumbPage>Pilihan Pertayaan Skoring</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title}</h1>{" "}
        <Button asChild>
          <Link
            href={route("scoring-question.show-store-options", {
              scoringQuestion: selectedScoringQuestion?.id,
            })}>
            Tambah Pilihan Pertanyaan
          </Link>
        </Button>
      </div>
    </>
  );
};

export default EditScoringQuestionOptionHeader;
