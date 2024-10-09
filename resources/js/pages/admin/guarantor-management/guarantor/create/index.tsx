import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import AdminLayout from "@/layouts/admin";
import { GuarantorCreatePageProps } from "@/pages/admin/guarantor-management/guarantor/create/branch-office-create-page.type";
import Form from "@/pages/admin/guarantor-management/guarantor/form";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";

const GuarantorCreatePage: GuarantorCreatePageProps = () => {
  const [dataProvinces, setDataProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [dataRegencies, setDataRegencies] = useState([]);
  const [selectedRegency, setSelectedRegency] = useState<number | null>(null);
  const [dataDistricts, setDataDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get(route("province.all"))
      .then((response) => {
        setDataProvinces(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      setDataRegencies([]);
      setSelectedRegency(null);
      setDataDistricts([]);
      setSelectedDistrict(null);
      axios
        .get(route("regency.by-province", selectedProvince))
        .then((response) => {
          setDataRegencies(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedRegency) {
      setDataDistricts([]);
      setSelectedDistrict(null);
      axios
        .get(route("district.by-regency", selectedRegency))
        .then((response) => {
          setDataDistricts(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [selectedRegency]);

  return (
    <main className="space-y-2.5 flex items-center justify-center">
      <div className="max-w-xl w-full">
        <header>
          <h2 className="text-lg font-medium text-gray-900">Membuat Kantor Cabang</h2>

          <p className="mt-1 text-sm text-gray-600">Untuk membuat data BPR kantor cabang baru</p>
        </header>

        <Form
          provinces={dataProvinces}
          selectProvince={setSelectedProvince}
          selectedProvince={selectedProvince}
          regencies={dataRegencies}
          selectRegency={setSelectedRegency}
          selectedRegency={selectedRegency}
          districts={dataDistricts}
          selectDistrict={setSelectedDistrict}
          selectedDistrict={selectedDistrict}
          routeSubmit={route("guarantor.store")}
          routeBack={route("guarantor.index")}
        />
      </div>
    </main>
  );
};

export default GuarantorCreatePage;

GuarantorCreatePage.layout = (page: any) => {
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
