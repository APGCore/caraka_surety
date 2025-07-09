import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import RoleBasedLayout from "@/layouts/role-based-layout";
import BranchBankForm from "../_partials/branch-bank-form";
import BranchBankHeader from "../_partials/branch-bank-header";
import { BranchBankUtils } from "../branch-bank.utils";
import { BranchBankCreatePageProps } from "./branch-bank-create-page.type";

const CabangBankCreatePage: BranchBankCreatePageProps = ({ bank }) => {
  return (
    <Card className="w-[800px] mx-auto">
      <CardHeader>
        <CardTitle>Membuat Data Cabang Bank</CardTitle>
        <CardDescription>Untuk membuat data cabang bank baru</CardDescription>
      </CardHeader>
      <CardContent>
        <BranchBankForm
          bank={{ headquarter_id: bank.id }}
          routeSubmit={route(BranchBankUtils.link.store)}
          routeBack={route(BranchBankUtils.link.index, { bank: bank.id })}
        />
      </CardContent>
    </Card>
  );
};

export default CabangBankCreatePage;

CabangBankCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <BranchBankHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
