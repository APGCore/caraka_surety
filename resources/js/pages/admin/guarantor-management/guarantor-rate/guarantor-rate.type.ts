import React from "react";

interface GuarantorRateProps {
  guarantors: any;
  guarantorSelected: any;
  products: any;
  productSelected: any;
  guarantorProductTypes: any;
}

export type GuarantorRatePageProps = React.FC<GuarantorRateProps> & {
  layout?: (page: any) => JSX.Element;
};
