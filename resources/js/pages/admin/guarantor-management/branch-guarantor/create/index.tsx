import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import AdminLayout from "@/layouts/admin";
import RoleBasedLayout from "@/layouts/role-based-layout";
import BranchGuarantorForm from "@/pages/admin/guarantor-management/branch-guarantor/_partials/branch-guarantor-form";
import BranchGuarantorHeader from "@/pages/admin/guarantor-management/branch-guarantor/_partials/branch-guarantor-header";
import { BranchGuarantorUtils } from "@/pages/admin/guarantor-management/branch-guarantor/branch-guarantor.utils";
import { BranchGuarantorCreatePageProps } from "@/pages/admin/guarantor-management/branch-guarantor/create/branch-guarantor-create-page.type";

const BranchGuarantorCreatePage: BranchGuarantorCreatePageProps = ({ guarantor }) => {
  const params = { guarantor: guarantor.id };

  return (
    <Card className="w-[800px] mx-auto">
      <CardHeader>
        <CardTitle>Membuat Data Cabang Asuransi {guarantor.name}</CardTitle>
        <CardDescription>Untuk membuat data cabang baru asuransi {guarantor.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <BranchGuarantorForm
          guarantor={guarantor}
          routeSubmit={route(BranchGuarantorUtils.link.store)}
          routeBack={route(BranchGuarantorUtils.link.index, params)}
        />
      </CardContent>
    </Card>
  );
};

export default BranchGuarantorCreatePage;

BranchGuarantorCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;
  const params = { guarantor: pagePropsData.guarantor.id };

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <BranchGuarantorHeader
        title={pagePropsData?.page_settings?.title}
        route={route(BranchGuarantorUtils.link.index, params)}
      />
      {page}
    </RoleBasedLayout>
  );
};
