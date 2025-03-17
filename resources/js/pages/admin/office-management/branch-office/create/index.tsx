import { Card, CardContent } from "@/components/_shadcn-ui/card";
import HeaderPage from "@/components/molecules/header";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { BranchOfficeCreatePageProps } from "@/pages/admin/office-management/branch-office/create/branch-office-create-page.type";
import Form from "../_partials/form";

const BranchOfficeCreatePage: BranchOfficeCreatePageProps = (props) => {
  return (
    <main className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Tambah Cabang BPR</h1>
      </div>
      <Card className="w-[800px] mx-auto">
        <CardContent>
          <Form routeSubmit={route("branch.store")} routeBack={route("branch.index")} />
        </CardContent>
      </Card>
    </main>
  );
};

export default BranchOfficeCreatePage;

BranchOfficeCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <HeaderPage {...pagePropsData} />
      {page}
    </RoleBasedLayout>
  );
};
