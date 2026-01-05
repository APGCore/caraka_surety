import React from "react";

interface ListRateProps {
  profileSelected: any;
  officeTypeSelected: any;
  guarantorSelected: any;
  guarantorBranchSelected: any;
  guarantorToProductTypeSelected: any;
  productSelected: any;
  jobGroupSelected: any;
  profileRates: any;
}

export type ListRatePageProps = React.FC<ListRateProps> & {
  layout?: (page: any) => JSX.Element;
};
