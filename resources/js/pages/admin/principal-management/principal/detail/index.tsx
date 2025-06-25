import { formatCurrency } from "@/_features/_common/utils/format-currency";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/_shadcn-ui/tabs";
import PrimaryButton from "@/components/atoms/button/primary-button";
import SecondaryButton from "@/components/atoms/button/secondary-button";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { PreviewFile } from "@/components/molecules/preview-file";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { PrincipalDetailPageProps } from "@/pages/admin/principal-management/principal/detail/detail-principal-page.type";
import { SubmissionStatus } from "@/types/submission-status";
import { Head, Link } from "@inertiajs/react";
import React from "react";

const PrincipalDetailPage: PrincipalDetailPageProps & { layout?: any } = ({ principal, submissions }) => {
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
              <TabsTrigger value="dokumen" className="flex-1 text-white">
                Dokumen Perusahaan
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ajuan">
              <h4 className="text-lg font-medium text-gray-900">Riwayat Pengajuan Jaminan</h4>
              <p className="mt-2 text-sm text-gray-600">
                Berikut adalah riwayat pengajuan jaminan yang dilakukan oleh principal.
              </p>
              <Table className="mt-2">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-0">#</TableHead>
                    <TableHead>Unit Bisnis</TableHead>
                    <TableHead>Produk</TableHead>
                    <TableHead>Tipe Produk</TableHead>
                    <TableHead>Nomor Jaminan</TableHead>
                    <TableHead>Nilai Jaminan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal Dibuat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <RenderList
                    of={submissions.data}
                    render={(submission: any, index: number) => (
                      <TableRow key={submission.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{submission.staff?.office}</TableCell>
                        <TableCell>{submission.product?.name}</TableCell>
                        <TableCell>{submission.product_type?.full_name}</TableCell>
                        <TableCell>{submission.no_guarantee}</TableCell>
                        <TableCell>{formatCurrency(submission.guarantee_value)}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 uppercase text-xs font-semibold rounded ${
                              submission.status === SubmissionStatus.APPROVED
                                ? "bg-green-100 text-green-800"
                                : submission.status === SubmissionStatus.REJECTED ||
                                    submission.status === SubmissionStatus.BROKEN
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}>
                            {submission.status_label}
                          </span>
                        </TableCell>
                        <TableCell>{submission?.created_at}</TableCell>
                      </TableRow>
                    )}
                    renderFallback={() => (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No data found
                        </TableCell>
                      </TableRow>
                    )}
                  />
                </TableBody>
              </Table>
              <ShowingCountDatatable meta={submissions.meta} />
              <PaginationDatatable meta={submissions.meta} />
            </TabsContent>

            <TabsContent value="dokumen">
              <h4 className="text-lg font-medium text-gray-900">Dokumen Perusahaan</h4>
              <p className="mt-2 text-sm text-gray-600">
                Berikut adalah dokumen perusahaan yang telah diunggah oleh principal.
              </p>
              <Show
                when={principal?.documents.length > 0}
                fallback={<p className="text-gray-500">Tidak ada dokumen yang diunggah.</p>}>
                <Table className="mt-2">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-0">#</TableHead>
                      <TableHead>Nama Dokumen</TableHead>
                      <TableHead>Deskripsi</TableHead>
                      <TableHead className="w-1 text-center">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <RenderList
                      of={principal.documents}
                      render={(doc: any, index: number) => (
                        <TableRow key={doc.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{doc.name}</TableCell>
                          <TableCell>{doc.description || "-"}</TableCell>
                          <TableCell align="center">
                            <Show when={!!doc.path} fallback="File Belum Diunggah">
                              <PreviewFile preview={doc.path} />
                            </Show>
                          </TableCell>
                        </TableRow>
                      )}
                      renderFallback={() => (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center">
                            Tidak ada dokumen yang diunggah.
                          </TableCell>
                        </TableRow>
                      )}
                    />
                  </TableBody>
                </Table>
              </Show>
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
