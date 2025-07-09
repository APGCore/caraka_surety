import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { BankUtils } from "@/pages/admin/bank-management/bank/bank.utils";
import { Head } from "@inertiajs/react";
import React from "react";

interface Props {
  title: string;
  button?: any;
}

const BankHeader: React.FC<Props> = ({ title, button }) => {
  return (
    <>
      <Head title={title ?? "Bank"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route(BankUtils.link.index)}>Kelola {title ?? "Bank"}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Bank"}</h1>
        {button}
      </div>
    </>
  );
};

export default BankHeader;
