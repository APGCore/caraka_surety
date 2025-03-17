import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Head } from "@inertiajs/react";
import ActivityTable from "./activity-table";
import { ListActivityPageProps } from "./list-activity-log-page.type";

const ListActivityLogPage: ListActivityPageProps = (props) => {
    return (
        <main className="space-y-10">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-3xl">Log Aktivitas</h1>
            </div>

            <div>
                <ActivityTable activities={props.activitylogs} meta={props.meta} />
            </div>
        </main>
    );
};

export default ListActivityLogPage;

ListActivityLogPage.layout = (page: any) => {
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
