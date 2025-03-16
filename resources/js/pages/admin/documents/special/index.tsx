import RoleBasedLayout from "@/layouts/role-based-layout";
import { Head } from "@inertiajs/react";
import { AdminDashboardPageProps } from "./documents-special-required.page.type";

const AdminDashboardPage: AdminDashboardPageProps = () => {
    return <div>Admin Dashboard Page</div>;
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
