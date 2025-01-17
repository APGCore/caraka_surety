import React from "react";

interface GuarantorRateCreateProps {
  guarantorId: any;
  guarantorBranchId: any;
  guarantorToProductTypeId: any;
  guarantorRate: any;
}

export type GuarantorRateCreatePageProps = React.FC<GuarantorRateCreateProps> & {
  layout?: (page: any) => JSX.Element;
};
