import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { GuarantorCreatePageProps } from "@/pages/admin/guarantor-management/guarantor/create/branch-office-create-page.type";
import Form from "@/pages/admin/guarantor-management/guarantor/form";
import { Head } from "@inertiajs/react";

const GuarantorCreatePage: GuarantorCreatePageProps = () => {
  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Membuat Data Penjamin</h2>
          <p className="mt-1 text-sm text-gray-600">Untuk membuat data penjamin (Principal) baru</p>
        </header>

        <Form routeSubmit={route("guarantor.store")} routeBack={route("guarantor.index")} />
      </div>
    </main>
  );
};

export default GuarantorCreatePage;

GuarantorCreatePage.layout = (page: any) => {
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
