import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { GuarantorEditPageProps } from "@/pages/admin/guarantor-management/guarantor/edit/guarantor-create-page.type";
import Form from "@/pages/admin/guarantor-management/guarantor/form";
import { Head } from "@inertiajs/react";

const GuarantorCreatePage: GuarantorEditPageProps = ({ guarantor }) => {
  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Mengubah Data Penjamin</h2>
          <p className="mt-1 text-sm text-gray-600">Untuk mengubah data penjamin (Principal)</p>
        </header>

        <Form
          guarantor={guarantor}
          routeSubmit={route("guarantor.update", guarantor.id)}
          routeBack={route("guarantor.index")}
        />
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
