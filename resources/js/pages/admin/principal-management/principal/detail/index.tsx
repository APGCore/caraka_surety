import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/_shadcn-ui/tabs";
import PrimaryButton from "@/components/atoms/button/primary-button";
import SecondaryButton from "@/components/atoms/button/secondary-button";
import RoleBasedLayout from "@/layouts/role-based-layout";
import {
    PrincipalDetailPageProps
} from "@/pages/admin/principal-management/principal/detail/detail-principal-page.type";
import { Head, Link } from "@inertiajs/react";

const PrincipalDetailPage: PrincipalDetailPageProps & { layout?: any } = ({ principal }) => {
  return (
    <main className="space-y-1.5 flex items justify-center w-full">
      <div className="w-full">
        <header className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Detail Principal {principal.name}</h2>
          <div className="flex space-x-2">
            <SecondaryButton>
              <Link href={route("principal.index")}>Kembali </Link>
            </SecondaryButton>
            <PrimaryButton>
              <Link href={route("principal.edit", principal.id)}>Edit</Link>
            </PrimaryButton>
          </div>
        </header>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Informasi Perusahaan</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nama</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.name}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Telepon</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.telephone}</dd>
              </div>
              {principal.fax && (
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Fax</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.fax}</dd>
                </div>
              )}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Alamat</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {principal.address}, {principal.village}, {principal.district.name}, {principal.regency.name},{" "}
                  {principal.province.name}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">NPWP</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.npwp}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">NIB</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.nib}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">SIUP/SIUJK</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.siup_siujk}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nama Kepala</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.head_name}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nama Direktur</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.director_name}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Jabatan Direktur</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.director_position}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Telepon Direktur</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.director_phone}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Komisaris</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.commissioner}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Tahun Berdiri</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.year_established}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Akta Terakhir</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.last_deed}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">PIC</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{principal.pic}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-8 mb-12">
          <Tabs defaultValue="ajuan" className="w-full">
            <TabsList className="w-full flex  bg-gray-700">
              <TabsTrigger value="ajuan" className="flex-1 text-white">
                Riwayat Ajuan
              </TabsTrigger>
              <TabsTrigger value="perusahaan" className="flex-1 text-white">
                Riwayat Perusahaan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ajuan">
              <h4 className="text-lg font-medium text-gray-900">Riwayat Ajuan</h4>
              <p className="mt-2 text-sm text-gray-600">Berikut adalah riwayat ajuan yang dilakukan oleh principal.</p>
              <table className="min-w-full bg-white mt-4">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-900">No</th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-900">Tanggal Ajuan</th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">1</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">12/10/2024</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Diterima</td>
                  </tr>
                </tbody>
              </table>
            </TabsContent>

            <TabsContent value="perusahaan">
              <h4 className="text-lg font-medium text-gray-900">Riwayat Perusahaan</h4>
              <p className="mt-2 text-sm text-gray-600">Berikut adalah riwayat perusahaan terkait principal.</p>
              <table className="min-w-full bg-white mt-4">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-900">No</th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-900">Perubahan</th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-900">Tanggal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">1</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Perubahan Direktur</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">01/09/2024</td>
                  </tr>
                </tbody>
              </table>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  );
};

PrincipalDetailPage.layout = (page: any) => {
  const pagePropsData = page.props;

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

export default PrincipalDetailPage;
