import React from "react";

interface GuarantorRateProps {
  guarantors: any;
  guarantorSelected: any;
  guarantorBranches: any;
  guarantorBranchSelected: any;
  products: any;
  productSelected: any;
  jobGroups: any;
  jobGroupSelected: any;
  jobTypes: any;
  jobTypeSelected: any;
  guarantorProductTypes: any;
}

export type GuarantorRatePageProps = React.FC<GuarantorRateProps> & {
  layout?: (page: any) => JSX.Element;
};
