import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { BankEditPageProps } from "@/pages/admin/bank-management/bank/edit/edit-bank-page.type";
import Form from "@/pages/admin/bank-management/bank/form";
import { Head } from "@inertiajs/react";

const BankEditPage: React.FC<BankEditPageProps> & { layout?: any } = ({ bank }) => {
  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Mengubah Data Bank</h2>

          <p className="mt-1 text-sm text-gray-600">Untuk mengubah data bank baru</p>
        </header>

        <Form bank={bank} routeSubmit={route("bank.update", bank.id)} routeBack={route("bank.index")} />
      </div>
    </main>
  );
};

export default BankEditPage;

BankEditPage.layout = (page: any) => {
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
