import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import RenderList from "@/components/common/render-list";
import StaffOperasionalLayoutPage from "@/layouts/staff-operasional";
import { DashboardUtils } from "@/pages/staff/dashboard/staff-dashboard-page.utils";
import { Head, router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { Overview } from "./_partials/overview";
import { RecentSales } from "./_partials/recent-sales";
import { StaffOperasionalDashboardPageProps } from "./staff-operasional-dashboard-page.type";

const StaffOperasionalDashboardPage: StaffOperasionalDashboardPageProps = ({
  total_submission,
  total_submission_process,
  total_submission_approved,
  total_submission_rejected,
  products,
  graph_data,
  submissions,
}) => {
  const changeProduct = (productId: any) => {
    router.get(
      route(DashboardUtils.link.index),
      pickBy({
        product_id: productId,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };
  return (
    <div className="flex-1 space-y-4  pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pengajuan</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total_submission}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pengajuan Diproses</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total_submission_process}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pengajuan Disetujui</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total_submission_approved}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pengajuan Ditolak</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{total_submission_rejected}</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 space-y-10">
            <div className="flex items-center justify-between w-full p-5 ">
              <CardTitle className=" w-max">Grafik Pengajuan</CardTitle>
              <Select onValueChange={changeProduct}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Surety Bond" />
                </SelectTrigger>
                <SelectContent>
                  <RenderList
                    of={products}
                    render={(product: any) => {
                      return <SelectItem value={product.id}>{product.name}</SelectItem>;
                    }}
                  />
                </SelectContent>
              </Select>
            </div>
            <CardContent className="pl-2">
              <Overview data={graph_data} />
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Pengajuan Terakhir</CardTitle>
              <CardDescription>Terdapat {submissions.length} pengajuan baru bulan ini.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales submissions={submissions} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffOperasionalDashboardPage;

StaffOperasionalDashboardPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <StaffOperasionalLayoutPage user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title ?? "Dashboard Admin"} />
      {page}
    </StaffOperasionalLayoutPage>
  );
};
