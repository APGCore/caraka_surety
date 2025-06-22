import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { EmployeePageEditProps } from "@/pages/admin/office-management/employee/edit/employee-edit-page.type";
import Form from "@/pages/admin/office-management/employee/form";
import { Head } from "@inertiajs/react";

const EmployeeCreatePage: EmployeePageEditProps = ({
  officeSelected,
  isHeadquarter,
  roles,
  roles_names,
  headers,
  employee,
  routeName,
}) => {
  return (
    <main>
      <div className="pt-5 pb-12 mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
        <div className="bg-white shadow sm:rounded-lg sm:p-8 max-w-3xl w-full">
          <header>
            <h2 className="text-lg font-medium text-gray-900">Ubah Pengguna</h2>

            <p className="mt-1 text-sm text-gray-600">Untuk mengubah data pengguna</p>
          </header>

          <Form
            roles={roles}
            roles_names={roles_names}
            headers={headers}
            employee={employee}
            officeSelected={officeSelected}
            isHeadquarter={isHeadquarter}
            routeName={routeName}
          />
        </div>
      </div>
    </main>
  );
};

export default EmployeeCreatePage;

EmployeeCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;
  console.log("page pengguna", pagePropsData);
  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <Head title={pagePropsData?.page_settings?.title} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{pagePropsData?.page_settings?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </RoleBasedLayout>
  );
};
