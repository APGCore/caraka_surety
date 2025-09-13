import React from "react";

interface DistributionBlankProps {
  guarantors: any;
  guarantorBranches: any;
  guarantorSelected: number;
  guarantorBranchSelected: number;
  offices: any;
  officeTypes: any;
  officeSelected: number;
  officeTypeSelected: number;
  blanks: any;
  picked: any;
}

export type DistributionBlankPageProps = React.FC<DistributionBlankProps> & {
  layout?: (page: any) => JSX.Element;
};
