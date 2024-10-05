import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { BranchOfficeFormPageProps } from "@/pages/admin/company-management/branch-office/branch-office-form-page.type";
import UpdateProfileBprInformation from "@/pages/profile/partials/update-profile-bpr-information-form";
import { Head } from "@inertiajs/react";

const BranchOfficeEditPage: React.FC<BranchOfficeFormPageProps> & { layout?: any } = ({
  profile,
  provinces,
  regencies,
  districts,
}) => {
  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <UpdateProfileBprInformation
          profile={profile}
          provinces={provinces}
          regencies={regencies}
          districts={districts}
        />
      </div>
    </main>
  );
};

export default BranchOfficeEditPage;

BranchOfficeEditPage.layout = (page: any) => {
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
