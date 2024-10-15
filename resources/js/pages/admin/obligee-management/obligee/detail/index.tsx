import PrimaryButton from "@/components/common/primary-button";
import SecondaryButton from "@/components/common/secondary-button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/layouts/admin";
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
              <p>Riwayat Ajuan...</p>
            </TabsContent>
            <TabsContent value="perusahaan">
              <p>Riwayat Perusahaan...</p>
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

export default ObligeeDetailPage;
