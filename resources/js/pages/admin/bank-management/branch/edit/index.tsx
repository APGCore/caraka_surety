import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import RoleBasedLayout from "@/layouts/role-based-layout";
import BranchBankForm from "../_partials/branch-bank-form";
import BranchBankHeader from "../_partials/branch-bank-header";
import { BranchBankUtils } from "../branch-bank.utils";
import { BranchBankEditPageProps } from "./branch-bank-edit-page.type";

const BankCreatePage: BranchBankEditPageProps = ({ branch }) => {
  return (
    <Card className="w-[800px] mx-auto">
      <CardHeader>
        <CardTitle>Mengubah Data Cabang Bank</CardTitle>
        <CardDescription>Untuk mengubah data cabang bank {branch.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <BranchBankForm
          bank={branch}
          routeSubmit={route(BranchBankUtils.link.update, branch.id)}
          routeBack={route(BranchBankUtils.link.index, { bank: branch.head?.id })}
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
      <BranchBankHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
