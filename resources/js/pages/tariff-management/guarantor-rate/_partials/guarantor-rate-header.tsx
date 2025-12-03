import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/_shadcn-ui/breadcrumb";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { Head } from "@inertiajs/react";
import React from "react";

interface GuarantorRateHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: {
    label: string;
    href: string;
  }[];
}

const GuarantorRateHeader: React.FC<GuarantorRateHeaderProps> = ({ title, description, breadcrumbs }) => {
  return (
    <>
      <Head title={title} />
      <Breadcrumb>
        <BreadcrumbList>
          <RenderList
            of={breadcrumbs}
            render={(breadcrumb: { label: string; href: string }, index: number) => (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.label}</BreadcrumbLink>
                </BreadcrumbItem>
                <Show when={index !== breadcrumbs.length - 1}>
                  <BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </BreadcrumbItem>
                </Show>
              </>
            )}
          />
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold md:text-3xl">{title}</h1>
          <p className="text-md text-gray-500">{description}</p>
        </div>
      </div>
    </>
  );
};

export default GuarantorRateHeader;
