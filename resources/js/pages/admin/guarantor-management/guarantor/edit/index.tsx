import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import RoleBasedLayout from "@/layouts/role-based-layout";
import GuarantorForm from "@/pages/admin/guarantor-management/guarantor/_partials/guarantor-form";
import { GuarantorEditPageProps } from "@/pages/admin/guarantor-management/guarantor/edit/guarantor-edit-page.type";
import { GuarantorUtils } from "@/pages/admin/guarantor-management/guarantor/guarantor.utils";
import { Head } from "@inertiajs/react";

const GuarantorEditPage: GuarantorEditPageProps = ({ guarantor }) => {
  return (
    <Card className="w-[800px] mx-auto">
      <CardHeader>
        <CardTitle>Mengubah Data Asuransi</CardTitle>
        <CardDescription>Untuk mengubah data asuransi</CardDescription>
      </CardHeader>
      <CardContent>
        <GuarantorForm
          guarantor={guarantor}
          routeSubmit={route(GuarantorUtils.link.update, guarantor.id)}
          routeBack={route(GuarantorUtils.link.index)}
        />
      </CardContent>
    </Card>
  );
};

export default GuarantorEditPage;

GuarantorEditPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <Head title={pagePropsData?.page_settings?.title} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{pagePropsData?.page_settings?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </RoleBasedLayout>
  );
};
