import HeaderPage from "@/components/molecules/header";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { BranchOfficeEditPageProps } from "@/pages/admin/office-management/branch-office/edit/branch-office-edit-page.type";
import Form from "../_partials/form";

const BranchOfficeEditPage: React.FC<BranchOfficeEditPageProps> & { layout?: any } = ({ profile }) => {
  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Mengubah Kantor Cabang</h2>

          <p className="mt-1 text-sm text-gray-600">Untuk mengubah data BPR kantor cabang baru</p>
        </header>

        <Form
          branchOffice={profile}
          routeSubmit={route("branch.update", profile.id)}
          routeBack={route("branch.index")}
        />
      </div>
    </main>
  );
};

export default BranchOfficeEditPage;

BranchOfficeEditPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <HeaderPage {...pagePropsData} />
      {page}
    </RoleBasedLayout>
  );
};
