import React from "react";

interface OfficeRateCreateProps {
  profileId: any;
  guarantorId: any;
  guarantorBranchId: any;
  guarantorToProductTypeId: any;
  guarantorRate: any;
}

export type OfficeRateCreatePageProps = React.FC<OfficeRateCreateProps> & {
  layout?: (page: any) => JSX.Element;
};
