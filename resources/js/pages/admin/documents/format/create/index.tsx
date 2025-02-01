import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import RoleBasedLayout from "@/layouts/role-based-layout";
import FormDocumentFormat from "@/pages/admin/documents/format/_partials/form-document-format";
import { CreateDocumentFormatPageProps } from "@/pages/admin/documents/format/create/create-document-format.type";
import { DocumentFormatUtils } from "@/pages/admin/documents/format/document-format.utils";
import { Head } from "@inertiajs/react";
import React from "react";

const CreateDocumentFormatPage: CreateDocumentFormatPageProps = ({
  guarantors,
  guarantorSelected,
  products,
  productSelected,
  guarantorProductTypes,
  guarantorProductTypeSelected,
}) => {
  return (
    <Card className="w-[800px] mx-auto">
      <CardHeader>
        <CardTitle>Membuat Format Dokumen</CardTitle>
        <CardDescription>Untuk membuat data format dokumen</CardDescription>
      </CardHeader>
      <CardContent>
        <FormDocumentFormat
          guarantors={guarantors}
          guarantorSelected={guarantorSelected}
          products={products}
          productSelected={productSelected}
          guarantorProductTypes={guarantorProductTypes}
          guarantorProductTypeSelected={guarantorProductTypeSelected}
        />
      </CardContent>
    </Card>
  );
};

export default CreateDocumentFormatPage;

CreateDocumentFormatPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title ?? "Membuat Format Dokumen"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route(DocumentFormatUtils.link.create)}>Membuat Kelola Format Dokumen</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </RoleBasedLayout>
  );
};
