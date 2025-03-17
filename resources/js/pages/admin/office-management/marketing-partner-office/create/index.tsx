import { Card, CardContent } from "@/components/_shadcn-ui/card";
import HeaderPage from "@/components/molecules/header";
import RoleBasedLayout from "@/layouts/role-based-layout";
import Form from "../_partials/form";
import { MarketingPartnerOfficeCreatePageProps } from "./marketing-partner-office-create-page.type";

const MarketingPartnerOfficeCreatePage: MarketingPartnerOfficeCreatePageProps = (props) => {
  return (
    <main className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Tambah Mitra Pemasaran</h1>
      </div>
      <Card className="w-[800px] mx-auto">
        <CardContent>
          <Form routeSubmit={route("branch-mitra-pemasaran.store")} routeBack={route("branch-mitra-pemasaran.index")} />
        </CardContent>
      </Card>
    </main>
  );
};

export default MarketingPartnerOfficeCreatePage;

MarketingPartnerOfficeCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <HeaderPage {...pagePropsData} />
      {page}
    </RoleBasedLayout>
  );
};
