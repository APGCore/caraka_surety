import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { BankEditPageProps } from "@/pages/admin/bank-management/bank/edit/edit-bank-page.type";
import Form from "@/pages/admin/bank-management/bank/form";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

const BankEditPage: React.FC<BankEditPageProps> & { layout?: any } = ({ bank, provinces, regencies, districts }) => {
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<{
    id: number;
    name: string;
    telephone: string;
    address: string;
    province_id: number | null;
    regency_id: number | null;
    district_id: number | null;
    village: string;
    fax: string;
    pic: string;
    picture: string;
  }>({
    id: bank.id,
    name: bank.name,
    telephone: bank.telephone,
    address: bank.address,
    province_id: bank.province_id,
    regency_id: bank.regency_id,
    district_id: bank.district_id,
    village: bank.village,
    fax: bank.fax,
    pic: bank.pic,
    picture: bank.picture,
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
    router.get(route("bank.index"));
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    patch(route("bank.update", data.id), {
      preserveScroll: true,
    });
  };

  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Mengubah Data Bank</h2>

          <p className="mt-1 text-sm text-gray-600">Untuk mengubah data bank baru</p>
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
