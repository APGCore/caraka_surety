import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import RoleBasedLayout from "@/layouts/role-based-layout";
import FormOfficeRate from "@/pages/tariff-management/office-rate/_partials/form-office-rate";
import OfficeRateHeader from "@/pages/tariff-management/office-rate/_partials/office-rate-header";
import { OfficeRateEditPageProps } from "./office-rate-edit.type";

const OfficeRateEdit: OfficeRateEditPageProps = ({ profileRate }) => {
  return (
    <Card className="w-[50%] mx-auto">
      <CardHeader></CardHeader>
      <CardContent>
        <FormOfficeRate
          profileId={profileRate?.profile_id}
          guarantorId={profileRate?.guarantor_id}
          guarantorBranchId={profileRate?.guarantor_branch_id}
          guarantorToProductTypeId={profileRate?.guarantor_to_product_type_id}
          rate={profileRate}
        />
      </CardContent>
    </Card>
  );
};

export default OfficeRateEdit;

OfficeRateEdit.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <OfficeRateHeader
        title={pagePropsData?.page_settings?.title}
        description={pagePropsData?.page_settings?.description}
      />
      {page}
    </RoleBasedLayout>
  );
};
