import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Head } from "@inertiajs/react";
import React from "react";

interface Props {
  title: string;
  links: any;
}

const BlankHeader: React.FC<Props> = ({ title, links }) => {
  return (
    <>
      <Head title={title ?? "Blangko"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route(links.index)}>Kelola {title ?? "Blangko"}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Blangko"}</h1>
      </div>
    </>
  );
};

export default BlankHeader;
