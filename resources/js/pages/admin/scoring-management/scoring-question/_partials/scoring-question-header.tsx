import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Button } from "@/components/_shadcn-ui/button";
import { Head, Link } from "@inertiajs/react";
import React from "react";
import FormSkoringQuestion from "./form-scoring-question";

interface ScoringQuestionHeaderProps {
  title: string;
}

const ScoringQuestionHeader: React.FC<ScoringQuestionHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Pertanyaan Skoring"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("scoring-question.index")}>Kelola Pertanyaan Skoring</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Skoring"}</h1>
        <FormSkoringQuestion />
        {/* <Button asChild>
          <Link href={route("scoring-question.create")}>Tambah Pertanyaan</Link>
        </Button> */}
      </div>
    </>
  );
};

export default ScoringQuestionHeader;
