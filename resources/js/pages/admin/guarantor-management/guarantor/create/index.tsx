import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/layouts/admin";
import FormGuarantor from "@/pages/admin/guarantor-management/guarantor/_partials/form-guarantor";
import GuarantorHeader from "@/pages/admin/guarantor-management/guarantor/_partials/guarantor-header";
import { GuarantorCreatePageProps } from "@/pages/admin/guarantor-management/guarantor/create/guarantor-create-page.type";

const GuarantorCreatePage: GuarantorCreatePageProps = () => {
  return (
    <Card className="w-[800px] mx-auto">
      <CardHeader>
        <CardTitle>Membuat Data Asuransi</CardTitle>
        <CardDescription>Untuk membuat data asuransi (Principal) baru</CardDescription>
      </CardHeader>
      <CardContent>
        <FormGuarantor routeSubmit={route("guarantor.store")} routeBack={route("guarantor.index")} />
      </CardContent>
    </Card>
  );
};

export default GuarantorCreatePage;

GuarantorCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <GuarantorHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </AdminLayout>
  );
};
