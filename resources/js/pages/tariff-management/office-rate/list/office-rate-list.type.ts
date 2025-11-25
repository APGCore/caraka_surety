import React from "react";

interface ListRateProps {
  profileSelected: any;
  guarantorSelected: any;
  guarantorBranchSelected: any;
  guarantorToProductTypeSelected: any;
  profileRates: any;
}

export type ListRatePageProps = React.FC<ListRateProps> & {
  layout?: (page: any) => JSX.Element;
};
