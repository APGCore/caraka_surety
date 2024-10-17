import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Head, Link } from "@inertiajs/react";
import React from "react";
import FormSkoring from "./form";

interface ScoringHeaderProps {
  title: string;
}

const ScoringHeader: React.FC<ScoringHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Skoring"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("scoring.index")}>Kelola Skoring</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Skoring"}</h1>
        <FormSkoring />
        {/* <Button asChild>
          <Link href={route("scoring.create")}>Tambah Skoring</Link>
        </Button> */}
      </div>
    </>
  );
};

export default ScoringHeader;
