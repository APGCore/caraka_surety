import HeaderPage from "@/components/common/header-page";
import AdminLayout from "@/layouts/admin";
import { BranchOfficeCreatePageProps } from "@/pages/admin/office-management/branch-office/create/branch-office-create-page.type";
import Form from "@/pages/admin/office-management/branch-office/form";

const BranchOfficeCreatePage: BranchOfficeCreatePageProps = (props) => {
  return (
    <main className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Tambah Kantor Cabang</h1>
      </div>
      <div className="max-w-[700px] w-full mx-auto">
        <Form routeSubmit={route("branch.store")} routeBack={route("branch.index")} />
      </div>
    </main>
  );
};

export default BranchOfficeCreatePage;

BranchOfficeCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <HeaderPage {...pagePropsData} />
      {page}
    </AdminLayout>
  );
};
