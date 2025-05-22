import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import RenderList from "@/components/atoms/render-list";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { KeuanganDashboardPageProps } from "@/pages/keuangan/dashboard/kauangan-dashboard-page.type";
import { Head, router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { Overview } from "./_partials/overview";
import { RecentSales } from "./_partials/recent-sales";
import { DashboardUtils } from "./keuangan-dashboard-page.utils";

const StaffDashboardPage: KeuanganDashboardPageProps = ({ products }) => {
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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4 space-y-10">
            <div className="flex items-center justify-between w-full p-5 ">
              <CardTitle className=" w-max">Grafik Invoice</CardTitle>
              <Select onValueChange={changeProduct}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Pilih Product" />
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
            {/*<CardContent className="pl-2">*/}
            {/*  <Overview data={graph_data} />*/}
            {/*</CardContent>*/}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboardPage;

StaffDashboardPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <Head title={pagePropsData?.page_settings?.title ?? "Dashboard Admin"} />
      {page}
    </RoleBasedLayout>
  );
};
