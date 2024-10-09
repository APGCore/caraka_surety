import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { Head } from "@inertiajs/react";
import Form from "../form";
import { CreateObligeePageProps } from "./create-obligee-page.type";

const ObligeeCreatePage: CreateObligeePageProps = () => {
  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Membuat data Obligee</h2>
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
