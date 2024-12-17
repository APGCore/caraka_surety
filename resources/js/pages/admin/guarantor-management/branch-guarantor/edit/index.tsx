import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/layouts/admin";
import BranchGuarantorForm from "@/pages/admin/guarantor-management/branch-guarantor/_partials/branch-guarantor-form";
import BranchGuarantorHeader from "@/pages/admin/guarantor-management/branch-guarantor/_partials/branch-guarantor-header";
import { BranchGuarantorUtils } from "@/pages/admin/guarantor-management/branch-guarantor/branch-guarantor.utils";
import { BranchGuarantorEditPageProps } from "@/pages/admin/guarantor-management/branch-guarantor/edit/branch-guarantor-edit-page.type";

const BranchGuarantorCreatePage: BranchGuarantorEditPageProps = ({ guarantor, branchGuarantor }) => {
  return (
    <Card className="w-[800px] mx-auto">
      <CardHeader>
        <CardTitle>Mengubah Data Cabang Asuransi</CardTitle>
        <CardDescription>Untuk mengubah data cabang asuransi</CardDescription>
      </CardHeader>
      <CardContent>
        <BranchGuarantorForm
          guarantor={guarantor}
          branchGuarantor={branchGuarantor}
          routeSubmit={route(BranchGuarantorUtils.link.update, branchGuarantor.id)}
          routeBack={route(BranchGuarantorUtils.link.index)}
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
    <AdminLayout user={pagePropsData?.auth?.user}>
      <BranchGuarantorHeader
        title={pagePropsData?.page_settings?.title}
        route={route(BranchGuarantorUtils.link.index, params)}
      />
      {page}
    </AdminLayout>
  );
};
