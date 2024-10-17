import React from "react";

interface DistributionBlankProps {
  guarantors: any;
  guarantorSelected: number;
  offices: any;
  officeSelected: number;
  blanks: any;
}

export type DistributionBlankPageProps = React.FC<DistributionBlankProps> & {
  layout?: (page: any) => JSX.Element;
};
