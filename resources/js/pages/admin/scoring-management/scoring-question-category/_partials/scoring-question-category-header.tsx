import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Head, Link } from "@inertiajs/react";
import React from "react";

interface ScoringQuestionHeaderProps {
  title: string;
}

const ScoringQuestionCategoryHeader: React.FC<ScoringQuestionHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Kategori Pertayaan Skoring"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("scoring-question-category.index")}>Kelola Kategori Pertanyaan</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Kategori Pertanyaan Skoring"}</h1>
        <Button asChild>
          <Link href={route("scoring-question-category.create")}>Tambah Kategori Pertanyaan</Link>
        </Button>
      </div>
    </>
  );
};

export default ScoringQuestionCategoryHeader;
