import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import RoleBasedLayout from "@/layouts/role-based-layout";
import FormGuarantorRate from "@/pages/tariff-management/guarantor-rate/_partials/form-guarantor-rate";
import GuarantorRateHeader from "@/pages/tariff-management/guarantor-rate/_partials/guarantor-rate-header";
import { GuarantorRateUtils } from "../guarantor-rate.utils";
import { GuarantorRateUpdatePageProps } from "./guarantor-rate-update.type";

const GuarantorRateUpdatePage: GuarantorRateUpdatePageProps = ({ guarantorRate }) => {
  const guarantorToProductType = guarantorRate?.guarantor_to_product_type;
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ubah Tarif Produk Asuransi {guarantorToProductType?.full_name}</CardTitle>
        <CardDescription>Silakan Isi Data Di bawah</CardDescription>
      </CardHeader>
      <CardContent>
        <FormGuarantorRate rate={guarantorRate} />
      </CardContent>
    </Card>
  );
};

export default GuarantorRateUpdatePage;

GuarantorRateUpdatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  const guarantorToProductType = pagePropsData.guarantorRate?.guarantor_to_product_type;
  const breadcrumbs = [
    { label: "Daftar Tarif Produk Asuransi", href: route(GuarantorRateUtils.link.index) },
    {
      label: "Daftar Tarif " + guarantorToProductType?.full_name,
      href: route(GuarantorRateUtils.link.list, {
        guarantor_id: guarantorToProductType?.guarantor_id,
        guarantor_to_product_type_id: guarantorToProductType?.id,
      }),
    },
    {
      label: "Ubah Tarif Produk Asuransi",
      href: route(GuarantorRateUtils.link.edit, { guarantorRate: pagePropsData.guarantorRate?.id }),
    },
  ];

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <GuarantorRateHeader title={pagePropsData?.page_settings?.title} breadcrumbs={breadcrumbs} />
      {page}
    </RoleBasedLayout>
  );
};
