import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { PrincipalEditPageProps } from "@/pages/admin/principal-management/principal/edit/edit-principal-page.type";
import Form from "@/pages/admin/principal-management/principal/form";
import { Head, router, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

const PrincipalEditPage: React.FC<PrincipalEditPageProps> & { layout?: any } = ({
  principal,
  provinces,
  regencies,
  districts,
}) => {
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<{
    id: number;
    name: string;
    telephone: string;
    address: string;
    province_id: number | null;
    regency_id: number | null;
    district_id: number | null;
    village: string;
    fax: string | null;
    pic: string | null;
    npwp: string | null;
    nib: string | null;
    siup_siujk: string | null;
    head_name: string | null;
    director_name: string;
    director_position: string | null;
    director_phone: string | null;
    commissioner: string | null;
    year_established: string | null;
    last_deed: string | null;
    picture: string | null;
    is_approved: boolean;
  }>({
    id: principal.id,
    name: principal.name,
    telephone: principal.telephone,
    address: principal.address,
    province_id: principal.province_id,
    regency_id: principal.regency_id,
    district_id: principal.district_id,
    village: principal.village,
    fax: principal.fax,
    pic: principal.pic,
    npwp: principal.npwp,
    nib: principal.nib,
    siup_siujk: principal.siup_siujk,
    head_name: principal.head_name,
    director_name: principal.director_name,
    director_position: principal.director_position,
    director_phone: principal.director_phone,
    commissioner: principal.commissioner,
    year_established: principal.year_established,
    last_deed: principal.last_deed,
    picture: principal.picture,
    is_approved: principal.is_approved,
  });

  const currentUrl = window.location.pathname;

  const selectProvince = (value: any) => {
    setData((previousData) => ({
      ...previousData,
      province_id: value.id,
      regency_id: null,
      district_id: null,
    }));

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
    setData((previousData) => ({
      ...previousData,
      regency_id: value.id,
      district_id: null,
    }));

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
    setData((previousData) => ({
      ...previousData,
      district_id: value.id,
    }));

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
    router.get(route("principal.index"));
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    patch(route("principal.update", data.id), {
      preserveScroll: true,
    });
  };

  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Mengubah Principal</h2>
          <p className="mt-1 text-sm text-gray-600">Untuk mengubah data principal baru</p>
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

export default PrincipalEditPage;

PrincipalEditPage.layout = (page: any) => {
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
