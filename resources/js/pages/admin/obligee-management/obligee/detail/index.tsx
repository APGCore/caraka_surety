import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/_shadcn-ui/tabs";
import PrimaryButton from "@/components/common/primary-button";
import SecondaryButton from "@/components/common/secondary-button";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { ObligeeDetailPageProps } from "@/pages/admin/obligee-management/obligee/detail/obligee-detail-page.type";
import { Head, Link } from "@inertiajs/react";

const ObligeeDetailPage: ObligeeDetailPageProps & { layout?: any } = ({ obligee }) => {
  return (
    <main className="space-y-1.5 flex items justify-center w-full">
      <div className="w-full">
        <header className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">Detail Obligee {obligee.name}</h2>
          <div className="flex gap-4">
            <SecondaryButton>
              <Link href={route("obligee.index")}>Kembali</Link>
            </SecondaryButton>
            <PrimaryButton>
              <Link href={route("obligee.edit", obligee.id)}>Edit</Link>
            </PrimaryButton>
          </div>
        </header>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-4">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Informasi Obligee</h3>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Nama</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{obligee.name}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Telepon</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{obligee.telephone}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Alamat</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {obligee.address}, {obligee.district.name}, {obligee.regency.name}, {obligee.province.name}
                </dd>
              </div>
              {obligee.fax && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Fax</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{obligee.fax}</dd>
                </div>
              )}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">PIC</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{obligee.pic}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="ajuan">
            <TabsList className="w-full flex bg-gray-700">
              <TabsTrigger value="ajuan" className="flex-1 text-white">
                Riwayat Ajuan
              </TabsTrigger>
              <TabsTrigger value="perusahaan" className="flex-1 text-white">
                Riwayat Perusahaan
              </TabsTrigger>
            </TabsList>
            <TabsContent value="ajuan">
              <p className="mt-2 text-sm text-gray-600 mt-4 mb-8">
                Berikut adalah riwayat ajuan perusahaan yang pernah menggunakan obligee {obligee.name}.
              </p>
              <table className="min-w-full bg-white mt-4">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-900">No</th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-900">Nama Perusahaan</th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-900">Tanggal Ajuan</th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">1</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">PT Sukses Jaya</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">12/10/2024</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Diterima</td>
                  </tr>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">2</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">CV Maju Bersama</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">11/10/2024</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Ditolak</td>
                  </tr>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">3</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">PT Aman Sejahtera</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">10/10/2024</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Diterima</td>
                  </tr>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">4</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">CV Murni Abadi</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">09/10/2024</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Menunggu</td>
                  </tr>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">5</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">PT Karya Bersama</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">08/10/2024</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Diterima</td>
                  </tr>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">6</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">CV Terus Maju</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">07/10/2024</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Ditolak</td>
                  </tr>
                </tbody>
              </table>
            </TabsContent>
            <TabsContent value="perusahaan" className="mt-5 mb-8">
              <p className="mt-2 text-sm text-gray-600 mt-4">
                Berikut adalah riwayat perusahaan yang menggunakan Obligee {obligee.name}.
              </p>
              <table className="min-w-full bg-white mt-4">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-900">No</th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-900">Nama Perusahaan</th>
                    <th className="border-b px-4 py-2 text-left text-sm font-medium text-gray-900">
                      Kategori Perusahaan
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">1</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">PT Maju Jaya</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Non Konstruksi</td>
                  </tr>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">2</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">CV Sukses Makmur</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Konstruksi</td>
                  </tr>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">3</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">PT Sejahtera Abadi</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Konstruksi</td>
                  </tr>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">4</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">CV Aman Sentosa</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Non Konstruksi</td>
                  </tr>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">5</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">PT Berkah Mulia</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Konstruksi</td>
                  </tr>
                  <tr>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">6</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">PT Harmoni Sejahtera</td>
                    <td className="border-b px-4 py-2 text-sm text-gray-900">Non Konstruksi</td>
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

ObligeeDetailPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
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

export default ObligeeDetailPage;
