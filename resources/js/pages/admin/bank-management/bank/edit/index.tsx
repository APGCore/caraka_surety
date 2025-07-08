import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import RoleBasedLayout from "@/layouts/role-based-layout";
import BankForm from "@/pages/admin/bank-management/bank/_partials/bank-form";
import { BankUtils } from "@/pages/admin/bank-management/bank/bank.utils";
import BankHeader from "../_partials/bank-header";
import { BankEditPageProps } from "./bank-edit-page.type";

const BankCreatePage: BankEditPageProps = ({ bank }) => {
  return (
    <Card className="w-[800px] mx-auto">
      <CardHeader>
        <CardTitle>Mengubah Data Bank</CardTitle>
        <CardDescription>Untuk mengubah data bank {bank.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <BankForm
          bank={bank}
          routeSubmit={route(BankUtils.link.update, bank.id)}
          routeBack={route(BankUtils.link.index)}
        />
      </CardContent>
    </Card>
  );
};

export default BankCreatePage;

BankCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <BankHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
