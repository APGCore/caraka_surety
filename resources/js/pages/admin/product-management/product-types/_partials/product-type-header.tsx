import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Button } from "@/components/_shadcn-ui/button";
import { Head, Link } from "@inertiajs/react";
import React from "react";

interface ProductTypeHeaderProps {
    title: string;
}

const ProductTypeHeader: React.FC<ProductTypeHeaderProps> = ({ title }) => {
    return (
        <>
            <Head title={title ?? "Jenis Produk"} />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={route("product-types.index")}>Kelola Jenis Produk</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-3xl">{title ?? "Jenis Produk"}</h1>
                <Button asChild>
                    <Link href={route("product-types.create")}>Tambah Jenis Produk</Link>
                </Button>
            </div>
        </>
    );
};

export default ProductTypeHeader;
