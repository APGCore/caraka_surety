import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { CreateBankPageProps } from "@/pages/admin/bank-management/bank/create/create-bank-page.type";
import Form from "@/pages/admin/bank-management/bank/form";
import { Head } from "@inertiajs/react";

const BankCreatePage: React.FC<CreateBankPageProps> & { layout?: any } = () => {
  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Membuat Data Bank</h2>

          <p className="mt-1 text-sm text-gray-600">Untuk membuat data bank</p>
        </header>

        <Form routeSubmit={route("bank.store")} routeBack={route("bank.index")} />
      </div>
    </main>
  );
};

export default BankCreatePage;

BankCreatePage.layout = (page: any) => {
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
