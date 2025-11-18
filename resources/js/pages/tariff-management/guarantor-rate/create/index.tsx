import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import RoleBasedLayout from "@/layouts/role-based-layout";
import FormGuarantorRate from "@/pages/tariff-management/guarantor-rate/_partials/form-guarantor-rate";
import GuarantorRateHeader from "@/pages/tariff-management/guarantor-rate/_partials/guarantor-rate-header";
import { GuarantorRateCreatePageProps } from "@/pages/tariff-management/guarantor-rate/create/guarantor-rate-create.type";
import { GuarantorRateUtils } from "../guarantor-rate.utils";

const GuarantorRateCreate: GuarantorRateCreatePageProps = ({
  guarantorId,
  guarantorBranchId,
  guarantorToProductTypeId,
  guarantorToProductType,
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
        <FormGuarantorRate
          guarantorId={guarantorId}
          guarantorBranchId={guarantorBranchId}
          guarantorToProductTypeId={guarantorToProductTypeId}
        />
      </CardContent>
    </Card>
  );
};

export default GuarantorRateCreate;

GuarantorRateCreate.layout = (page: any) => {
  const pagePropsData = page.props;

  const breadcrumbs = [
    { label: "Daftar Tarif Produk Asuransi", href: route(GuarantorRateUtils.link.index) },
    {
      label: "Daftar Tarif Produk Asuransi",
      href: route(GuarantorRateUtils.link.list, {
        guarantor_id: pagePropsData.guarantorId,
        guarantor_to_product_type_id: pagePropsData.guarantorToProductTypeId,
      }),
    },
    {
      label: "Tambah Tarif Produk Asuransi",
      href: route(GuarantorRateUtils.link.create, {
        guarantor_id: pagePropsData.guarantorId,
        guarantor_to_product_type_id: pagePropsData.guarantorToProductTypeId,
      }),
    },
  ];

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <GuarantorRateHeader title={pagePropsData?.page_settings?.title} breadcrumbs={breadcrumbs} />
      {page}
    </RoleBasedLayout>
  );
};
