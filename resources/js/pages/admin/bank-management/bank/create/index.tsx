import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import RoleBasedLayout from "@/layouts/role-based-layout";
import BankForm from "../_partials/bank-form";
import BankHeader from "../_partials/bank-header";
import { BankUtils } from "../bank.utils";
import { BankCreatePageProps } from "./bank-create-page.type";

const BankCreatePage: BankCreatePageProps = () => {
  return (
    <Card className="w-[800px] mx-auto">
      <CardHeader>
        <CardTitle>Membuat Data Bank</CardTitle>
        <CardDescription>Untuk membuat data bank baru</CardDescription>
      </CardHeader>
      <CardContent>
        <BankForm routeSubmit={route(BankUtils.link.store)} routeBack={route(BankUtils.link.index)} />
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
