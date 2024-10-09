import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { Head } from "@inertiajs/react";
import Form from "../form";
import { CreateBankPageProps } from "./create-bank-management.type";

const BankCreatePage: CreateBankPageProps = () => {
  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Tambah Data Bank</h2>
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
