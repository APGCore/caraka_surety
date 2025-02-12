import SubmissionCreateHeader from "./_partials/create-page-header";
import { SubmissionCreatePageProps } from "./create-page.type";
import RoleBasedLayout from "@/layouts/role-based-layout";

const SubmissionCreatePage: SubmissionCreatePageProps = () => {
  return <div>SubmissionCreatePage</div>;
};

export default SubmissionCreatePage;

SubmissionCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <SubmissionCreateHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
