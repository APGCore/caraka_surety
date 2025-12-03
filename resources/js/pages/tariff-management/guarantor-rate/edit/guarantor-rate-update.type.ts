import React from "react";

interface GuarantorRateUpdateProps {
  guarantorToProductType: any;
  guarantorRate: any;
}

export type GuarantorRateUpdatePageProps = React.FC<GuarantorRateUpdateProps> & {
  layout?: (page: any) => JSX.Element;
};
