import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import AdminLayout from "@/layouts/admin";
import FormDocumentFormat from "@/pages/admin/documents/format/_partials/form-document-format";
import { DocumentFormatUtils } from "@/pages/admin/documents/format/document-format.utils";
import { EditDocumentFormatPageProps } from "@/pages/admin/documents/format/edit/edit-document-format.type";
import { Head } from "@inertiajs/react";
import React from "react";

const CreateDocumentFormatPage: EditDocumentFormatPageProps = ({
  guarantors,
  guarantorSelected,
  products,
  productSelected,
  guarantorProductTypes,
  guarantorProductTypeSelected,
  documentFormat,
}) => {
  return (
    <Card className="w-[800px] mx-auto">
      <CardHeader>
        <CardTitle>Editor Format Dokumen</CardTitle>
        <CardDescription>Untuk edit data format dokumen</CardDescription>
      </CardHeader>
      <CardContent>
        <FormDocumentFormat
          isEdit={true}
          guarantors={guarantors}
          guarantorSelected={guarantorSelected}
          products={products}
          productSelected={productSelected}
          guarantorProductTypes={guarantorProductTypes}
          guarantorProductTypeSelected={guarantorProductTypeSelected}
          documentFormat={documentFormat}
        />
      </CardContent>
    </Card>
  );
};

export default CreateDocumentFormatPage;

CreateDocumentFormatPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title ?? "Membuat Format Dokumen"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route(DocumentFormatUtils.link.create)}>Membuat Kelola Format Dokumen</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </AdminLayout>
  );
};
