import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/layouts/admin";
import FormGuarantorRate from "@/pages/admin/guarantor-management/guarantor-rate/_partials/form-guarantor-rate";
import GuarantorRateHeader from "@/pages/admin/guarantor-management/guarantor-rate/_partials/guarantor-rate-header";
import { GuarantorRateCreatePageProps } from "@/pages/admin/guarantor-management/guarantor-rate/create/guarantor-rate-create.type";

const GuarantorRateCreate: GuarantorRateCreatePageProps = ({ guarantor, guarantorToProductType, guarantorRate }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Kelola Tarif Produk Asuransi {guarantorToProductType?.full_name}</CardTitle>
        <CardDescription>Silakan Isi Data Di bawah</CardDescription>
      </CardHeader>
      <CardContent>
        <FormGuarantorRate guarantor={guarantor} guarantorToProductType={guarantorToProductType} rate={guarantorRate} />
      </CardContent>
    </Card>
  );
};

export default GuarantorRateCreate;

GuarantorRateCreate.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <GuarantorRateHeader title={pagePropsData?.page_settings?.title} guarantor={pagePropsData?.guarantor} />
      {page}
    </AdminLayout>
  );
};
