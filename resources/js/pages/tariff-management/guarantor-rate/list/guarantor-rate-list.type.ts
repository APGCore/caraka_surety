import React from "react";

interface ListRateProps {
  guarantorSelected: any;
  guarantorBranchSelected: any;
  guarantorToProductTypeSelected: any;
  guarantorRates: any;
}

export type ListRatePageProps = React.FC<ListRateProps> & {
  layout?: (page: any) => JSX.Element;
};
