import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { EmployeePageCreateProps } from "@/pages/admin/office-management/employee/create/employee-create-page.type";
import Form from "@/pages/admin/office-management/employee/form";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

const EmployeeCreatePage: EmployeePageCreateProps = ({ officeSelected, roles }) => {
  const { data, setData, post, errors, processing, recentlySuccessful } = useForm<{
    name: string;
    email: string;
    phone: string;
    role_id: number | null;
    profile_id: number;
    password: string;
    password_confirmation: string;
  }>({
    name: "",
    email: "",
    phone: "",
    role_id: null,
    profile_id: officeSelected,
    password: "",
    password_confirmation: "",
  });

  const submitForm: FormEventHandler<HTMLFormElement> = (event: any) => {
    event.preventDefault();
    post(route("employee.store"), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        router.get(route("employee.index", { office_id: officeSelected }));
      },
    });
  };
  return (
    <main>
      <div className="pt-5 pb-12 mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="bg-white shadow sm:rounded-lg sm:p-8 max-w-3xl w-full">
          <header>
            <h2 className="text-lg font-medium text-gray-900">Input Karyawan Baru</h2>

            <p className="mt-1 text-sm text-gray-600">Untuk membuat data karyawan baru</p>
          </header>

          <Form submitForm={submitForm} data={data} setData={setData} roles={roles} errors={errors} />
        </div>
      </div>
    </main>
  );
};

export default EmployeeCreatePage;

EmployeeCreatePage.layout = (page: any) => {
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
