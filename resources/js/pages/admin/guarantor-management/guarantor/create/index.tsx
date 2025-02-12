import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import RoleBasedLayout from "@/layouts/role-based-layout";
import GuarantorForm from "@/pages/admin/guarantor-management/guarantor/_partials/guarantor-form";
import GuarantorHeader from "@/pages/admin/guarantor-management/guarantor/_partials/guarantor-header";
import { GuarantorCreatePageProps } from "@/pages/admin/guarantor-management/guarantor/create/guarantor-create-page.type";
import { GuarantorUtils } from "@/pages/admin/guarantor-management/guarantor/guarantor.utils";

const GuarantorCreatePage: GuarantorCreatePageProps = () => {
  return (
    <Card className="w-[800px] mx-auto">
      <CardHeader>
        <CardTitle>Membuat Data Asuransi</CardTitle>
        <CardDescription>Untuk membuat data asuransi baru</CardDescription>
      </CardHeader>
      <CardContent>
        <GuarantorForm routeSubmit={route(GuarantorUtils.link.store)} routeBack={route(GuarantorUtils.link.index)} />
      </CardContent>
    </Card>
  );
};

export default GuarantorCreatePage;

GuarantorCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <GuarantorHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
