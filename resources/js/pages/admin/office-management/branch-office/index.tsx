import ListOfficePage from "@/_features/office/pages/list-office-page";
import HeaderPage from "@/components/molecules/header";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { BranchOfficePageProps } from "@/pages/admin/office-management/branch-office/branch-office-page.type";

const BranchOfficePage: BranchOfficePageProps = (props) => {
  return <ListOfficePage officeType={props.officeType} />;
};

export default BranchOfficePage;

BranchOfficePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <HeaderPage {...pagePropsData} />
      {page}
    </RoleBasedLayout>
  );
};
