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
}) => {
  return (
    <Card className="w-[50%] mx-auto">
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
        description={pagePropsData?.page_settings?.description}
      />
      {page}
    </RoleBasedLayout>
  );
};
