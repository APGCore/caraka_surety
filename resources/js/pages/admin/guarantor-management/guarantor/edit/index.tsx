import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/layouts/admin";
import GuarantorForm from "@/pages/admin/guarantor-management/guarantor/_partials/guarantor-form";
import { GuarantorEditPageProps } from "@/pages/admin/guarantor-management/guarantor/edit/guarantor-create-page.type";
import { GuarantorUtils } from "@/pages/admin/guarantor-management/guarantor/guarantor.utils";
import { Head } from "@inertiajs/react";

const GuarantorCreatePage: GuarantorEditPageProps = ({ guarantor }) => {
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

export default GuarantorCreatePage;

GuarantorCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{pagePropsData?.page_settings?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </AdminLayout>
  );
};
