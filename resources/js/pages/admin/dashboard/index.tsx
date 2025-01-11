import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/layouts/admin";
import { Head } from "@inertiajs/react";
import Analytics from "./_partials/analytics";
import Overview from "./_partials/overview";
import Reports from "./_partials/reports";
import { AdminDashboardPageProps } from "./admin-dashboard-page.type";

const AdminDashboardPage: AdminDashboardPageProps = (props) => {
  return (
    <div className="flex-1 space-y-4  pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
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
      </Tabs>
    </div>
  );
};

export default AdminDashboardPage;

AdminDashboardPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title ?? "Dashboard Admin"} />
      {page}
    </AdminLayout>
  );
};
