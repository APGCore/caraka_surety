import React from "react";

interface OfficeRateProps {
  offices: any;
  officeTypes: any;
  officeSelected: any;
  officeTypeSelected: any;
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

export type OfficeRatePageProps = React.FC<OfficeRateProps> & {
  layout?: (page: any) => JSX.Element;
};
