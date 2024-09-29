import ExampleLayoutPage from "@/layouts/example";
import { Head } from "@inertiajs/react";
import { ExampleDashboardPageProps } from "./example-dashboard.type";

const ExampleDashboardPage: ExampleDashboardPageProps = () => {
  return <div>ExampleDashboardPage</div>;
};

export default ExampleDashboardPage;

ExampleDashboardPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <ExampleLayoutPage user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title ?? "Dashboard Admin"} />
      {page}
    </ExampleLayoutPage>
  );
};
