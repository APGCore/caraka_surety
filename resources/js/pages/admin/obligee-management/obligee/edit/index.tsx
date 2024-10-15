import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { ObligeeEditPageProps } from "@/pages/admin/obligee-management/obligee/edit/edit-obligee-page.type";
import Form from "@/pages/admin/obligee-management/obligee/form";
import { Head } from "@inertiajs/react";

const ObligeeEditPage: React.FC<ObligeeEditPageProps> & { layout?: any } = ({ obligee }) => {
  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Mengubah Obligee</h2>

          <p className="mt-1 text-sm text-gray-600">Untuk mengubah data obligee baru</p>
        </header>

        <Form obligee={obligee} routeSubmit={route("obligee.update", obligee.id)} routeBack={route("obligee.index")} />
      </div>
    </main>
  );
};

export default ObligeeEditPage;

ObligeeEditPage.layout = (page: any) => {
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
