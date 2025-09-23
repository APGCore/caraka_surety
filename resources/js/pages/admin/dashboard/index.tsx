import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/_shadcn-ui/tabs";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Head, router, usePage } from "@inertiajs/react";
import Analytics from "./_partials/analytics";
import Overview from "./_partials/overview";
import Reports from "./_partials/reports";
import Summary from "./_partials/summary";
import { AdminDashboardPageProps } from "./admin-dashboard-page.type";

const AdminDashboardPage: AdminDashboardPageProps = (props) => {
  const { url } = usePage();
  const params = new URLSearchParams(url.split("?")[1]);
  const activeTab = params.get("tab") ?? "overview";

  return (
    <div className="flex-1 space-y-4  pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs
        defaultValue={activeTab}
        className="space-y-4"
        onValueChange={(value) => {
          if (value === "overview") {
            router.get(route("admin.index"), {}, { replace: true });
          } else {
            router.get(
              route("admin.index"),
              { tab: value },
              { preserveState: true, preserveScroll: true, replace: true },
            );
          }
        }}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview {...props} />
        </TabsContent>
        <TabsContent value="analytics">
          <Analytics />
        </TabsContent>
        <TabsContent value="reports">
          <Reports />
        </TabsContent>
        <TabsContent value="summary">
          <Summary {...props} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;

AdminDashboardPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <Head title={pagePropsData?.page_settings?.title ?? "Dashboard Admin"} />
      {page}
    </RoleBasedLayout>
  );
};
