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

interface CreateProductTypeHeaderProps {
  title: string;
}

const CreateProductTypeHeader: React.FC<CreateProductTypeHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Tambah Jenis Produk"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("product-types.index")}>Kelola Jenis Produk</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Jenis Produk</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title}</h1>
      </div>
    </>
  );
};

export default CreateProductTypeHeader;
