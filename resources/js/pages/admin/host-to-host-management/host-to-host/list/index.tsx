import ListHostToHostPage from "@/_features/host-to-host/pages/list-host-to-host-page";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Head } from "@inertiajs/react";
import { ListHostToHostPageProps } from "./list-host-to-host-page.type";

const ListHostToHost: ListHostToHostPageProps = (props) => {
  return <ListHostToHostPage />;
};

export default ListHostToHost;

ListHostToHost.layout = (page: any) => {
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
