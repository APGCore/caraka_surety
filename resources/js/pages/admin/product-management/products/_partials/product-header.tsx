import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Button } from "@/components/_shadcn-ui/button";
import { Head, Link } from "@inertiajs/react";
import React from "react";

interface ProductHeaderProps {
  title: string;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ title }) => {
  return (
    <>
      <Head title={title ?? "Produk"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("products.index")}>Kelola Produk</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Produk"}</h1>
        <Button asChild>
          <Link href={route("products.create")}>Tambah Produk</Link>
        </Button>
      </div>
    </>
  );
};

export default ProductHeader;
