import RoleBasedLayout from "@/layouts/role-based-layout";
import StaffLayoutPage from "@/layouts/staff";
import SubmissionCreateHeader from "./_partials/create-page-header";
import { SubmissionCreatePageProps } from "./create-page.type";

const SubmissionCreatePage: SubmissionCreatePageProps = () => {
  return <div>SubmissionCreatePage</div>;
};

export default SubmissionCreatePage;

SubmissionCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <SubmissionCreateHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
