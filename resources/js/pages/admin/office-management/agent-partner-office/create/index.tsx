import HeaderPage from "@/components/common/header-page";
import { Card, CardContent } from "@/components/ui/card";
import AdminLayout from "@/layouts/admin";
import Form from "../_partials/form";
import { AgentPartnerOfficeCreatePageProps } from "./agent-partner-office-create-page.type";

const AgentPartnerOfficeCreatePage: AgentPartnerOfficeCreatePageProps = (props) => {
  return (
    <main className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Tambah Mitra Agen</h1>
      </div>
      <Card className="w-[800px] mx-auto">
        <CardContent>
          <Form routeSubmit={route("branch.store")} routeBack={route("branch.index")} />
        </CardContent>
      </Card>
    </main>
  );
};

export default AgentPartnerOfficeCreatePage;

AgentPartnerOfficeCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <HeaderPage {...pagePropsData} />
      {page}
    </AdminLayout>
  );
};
