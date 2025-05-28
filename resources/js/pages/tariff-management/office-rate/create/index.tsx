import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import RoleBasedLayout from "@/layouts/role-based-layout";
import FormOfficeRate from "@/pages/tariff-management/office-rate/_partials/form-office-rate";
import OfficeRateHeader from "@/pages/tariff-management/office-rate/_partials/office-rate-header";
import { OfficeRateCreatePageProps } from "@/pages/tariff-management/office-rate/create/office-rate-create.type";

const OfficeRateCreate: OfficeRateCreatePageProps = ({
  profileId,
  guarantorId,
  guarantorBranchId,
  guarantorToProductTypeId,
  guarantorToProductType,
  guarantorRate,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Kelola Tarif Produk Asuransi {guarantorToProductType?.product?.name} {guarantorToProductType?.full_name}
        </CardTitle>
        <CardDescription>Silakan Isi Data Di bawah</CardDescription>
      </CardHeader>
      <CardContent>
        <FormOfficeRate
          profileId={profileId}
          guarantorId={guarantorId}
          guarantorBranchId={guarantorBranchId}
          guarantorToProductTypeId={guarantorToProductTypeId}
          rate={guarantorRate}
        />
      </CardContent>
    </Card>
  );
};

export default OfficeRateCreate;

OfficeRateCreate.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <OfficeRateHeader
        title={pagePropsData?.page_settings?.title}
        profile={pagePropsData?.profile}
        guarantor={pagePropsData?.guarantor}
      />
      {page}
    </RoleBasedLayout>
  );
};
