import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/layouts/admin";
import FormGuarantor from "@/pages/admin/guarantor-management/guarantor/_partials/form-guarantor";
import { GuarantorEditPageProps } from "@/pages/admin/guarantor-management/guarantor/edit/guarantor-create-page.type";
import { Head } from "@inertiajs/react";

const GuarantorCreatePage: GuarantorEditPageProps = ({ guarantor }) => {
  return (
    <Card className="w-[800px] mx-auto">
      <CardHeader>
        <CardTitle>Mengubah Data Asuransi</CardTitle>
        <CardDescription>Untuk mengubah data asuransi (Principal)</CardDescription>
      </CardHeader>
      <CardContent>
        <FormGuarantor
          guarantor={guarantor}
          routeSubmit={route("guarantor.update", guarantor.id)}
          routeBack={route("guarantor.index")}
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
