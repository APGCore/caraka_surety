import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { BranchOfficeCreatePageProps } from "@/pages/admin/office-management/branch-office/create/branch-office-create-page.type";
import Form from "@/pages/admin/office-management/branch-office/form";
import { Head } from "@inertiajs/react";

const BranchOfficeCreatePage: React.FC<BranchOfficeCreatePageProps> & { layout?: any } = () => {
  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Membuat Kantor Cabang</h2>

          <p className="mt-1 text-sm text-gray-600">Untuk membuat data BPR kantor cabang baru</p>
        </header>

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
      <Head title={pagePropsData?.page_settings?.title} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{pagePropsData?.page_settings?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </AdminLayout>
  );
};
