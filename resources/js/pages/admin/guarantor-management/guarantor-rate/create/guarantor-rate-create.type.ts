import React from "react";

interface GuarantorRateCreateProps {
  guarantor: any;
  guarantorToProductType: any;
  guarantorRate: any;
}

export type GuarantorRateCreatePageProps = React.FC<GuarantorRateCreateProps> & {
  layout?: (page: any) => JSX.Element;
};
