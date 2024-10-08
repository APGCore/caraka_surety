import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { BranchOfficeCreatePageProps } from "@/pages/admin/office-management/branch-office/create/branch-office-create-page.type";
import Form from "@/pages/admin/office-management/branch-office/form";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

const BranchOfficeCreatePage: React.FC<BranchOfficeCreatePageProps> & { layout?: any } = ({
  provinces,
  regencies,
  districts,
}) => {
  const { data, setData, post, errors, processing, recentlySuccessful } = useForm<{
    name: string;
    email: string;
    phone: string;
    address: string;
    province_id: number | null;
    regency_id: number | null;
    district_id: number | null;
    village: string;
    postal_code: string;
  }>({
    name: "",
    email: "",
    phone: "",
    address: "",
    province_id: null,
    regency_id: null,
    district_id: null,
    village: "",
    postal_code: "",
  });

  const currentUrl = window.location.pathname;

  const selectProvince = (value: any) => {
    setData((previousData) => {
      return {
        ...previousData,
        province_id: value.id,
        regency_id: null,
        district_id: null,
      };
    });

    router.get(
      currentUrl,
      {
        province_id: value.id,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const selectRegency = (value: any) => {
    setData((previousData) => {
      return {
        ...previousData,
        regency_id: value.id,
        district_id: null,
      };
    });

    router.get(
      currentUrl,
      {
        province_id: data.province_id,
        regency_id: value.id,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const selectDistrict = (value: any) => {
    setData((previousData) => {
      return {
        ...previousData,
        district_id: value.id,
      };
    });

    router.get(
      currentUrl,
      {
        province_id: data.province_id,
        regency_id: data.regency_id,
        district_id: value.id,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const cancel = () => {
    router.get(route("branch.index"));
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("branch.store"), {
      preserveScroll: true,
    });
  };

  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Membuat Kantor Cabang</h2>

          <p className="mt-1 text-sm text-gray-600">Untuk membuat data BPR kantor cabang baru</p>
        </header>

        <Form
          submitForm={submit}
          data={data}
          provinces={provinces}
          selectProvince={selectProvince}
          regencies={regencies}
          selectRegency={selectRegency}
          districts={districts}
          selectDistrict={selectDistrict}
          setData={setData}
          errors={errors}
          processing={processing}
          recentlySuccessful={recentlySuccessful}
          cancel={cancel}
        />
      </div>
    </main>
  );
};

export default BranchOfficeCreatePage;

BranchOfficeCreatePage.layout = (page: any) => {
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
