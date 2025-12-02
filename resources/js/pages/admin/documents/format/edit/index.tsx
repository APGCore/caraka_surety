import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import RoleBasedLayout from "@/layouts/role-based-layout";
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Editor Dokumen Luaran</CardTitle>
        <CardDescription>Untuk edit data Dokumen Luaran</CardDescription>
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
    <RoleBasedLayout propsData={pagePropsData}>
      <Head title={pagePropsData?.page_settings?.title ?? "Membuat Dokumen Luaran"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route(DocumentFormatUtils.link.create)}>Membuat Kelola Dokumen Luaran</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </RoleBasedLayout>
  );
};
