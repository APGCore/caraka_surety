import HeaderPage from "@/components/common/header-page";
import { Card, CardContent } from "@/components/ui/card";
import AdminLayout from "@/layouts/Admin";
import { BranchOfficeEditPageProps } from "@/pages/admin/office-management/branch-office/edit/branch-office-edit-page.type";
import Form from "../_partials/form";

const BranchOfficeEditPage: React.FC<BranchOfficeEditPageProps> & { layout?: any } = ({ profile }) => {
  return (
    <main className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Ubah Cabang BPR</h1>
      </div>
      <Card className="w-[800px] mx-auto">
        <CardContent>
          <Form
            branchOffice={profile}
            routeSubmit={route("branch.update", profile.id)}
            routeBack={route("branch.index")}
          />
        </CardContent>
      </Card>
    </main>
  );
};

export default BranchOfficeEditPage;

BranchOfficeEditPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <HeaderPage {...pagePropsData} />
      {page}
    </AdminLayout>
  );
};
