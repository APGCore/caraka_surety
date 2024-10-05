import AdminLayout from "@/layouts/admin";
import { Head } from "@inertiajs/react";
import { AdminDashboardPageProps } from "./admin-dashboard-page.type";

const AdminDashboardPage: AdminDashboardPageProps = () => {
  return <div>Admin Dashboard Page</div>;
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
