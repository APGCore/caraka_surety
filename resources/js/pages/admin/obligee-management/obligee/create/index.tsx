import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import AdminLayout from "@/layouts/Admin";
import { CreateObligeePageProps } from "@/pages/admin/obligee-management/obligee/create/create-obligee-page.type";
import Form from "@/pages/admin/obligee-management/obligee/form";
import { Head } from "@inertiajs/react";

const ObligeeCreatePage: React.FC<CreateObligeePageProps> & { layout?: any } = () => {
  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="border p-12 rounded-md shadow-md  max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Membuat Data Obligee</h2>

          <p className="mt-1 text-sm text-gray-600">Untuk membuat data obligee</p>
        </header>

        <Form routeSubmit={route("obligee.store")} routeBack={route("obligee.index")} />
      </div>
    </main>
  );
};

export default ObligeeCreatePage;

ObligeeCreatePage.layout = (page: any) => {
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
