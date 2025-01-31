import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import AdminLayout from "@/layouts/admin";
import RoleBasedLayout from "@/layouts/role-based-layout";
import FormGuarantorRate from "@/pages/admin/guarantor-management/guarantor-rate/_partials/form-guarantor-rate";
import GuarantorRateHeader from "@/pages/admin/guarantor-management/guarantor-rate/_partials/guarantor-rate-header";
import { GuarantorRateCreatePageProps } from "@/pages/admin/guarantor-management/guarantor-rate/create/guarantor-rate-create.type";

const GuarantorRateCreate: GuarantorRateCreatePageProps = ({
  guarantorId,
  guarantorBranchId,
  guarantorToProductTypeId,
  guarantorRate,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kelola Tarif Produk Asuransi {guarantorToProductTypeId?.full_name}</CardTitle>
        <CardDescription>Silakan Isi Data Di bawah</CardDescription>
      </CardHeader>
      <CardContent>
        <FormGuarantorRate
          guarantorId={guarantorId}
          guarantorBranchId={guarantorBranchId}
          guarantorToProductTypeId={guarantorToProductTypeId}
          rate={guarantorRate}
        />
      </CardContent>
    </Card>
  );
};

export default GuarantorRateCreate;

GuarantorRateCreate.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <GuarantorRateHeader title={pagePropsData?.page_settings?.title} guarantor={pagePropsData?.guarantor} />
      {page}
    </RoleBasedLayout>
  );
};
