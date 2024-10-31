import React from "react";

interface GuarantorRateCreateProps {
  guarantorToProductType: any;
}

export type GuarantorRateCreatePageProps = React.FC<GuarantorRateCreateProps> & {
  layout?: (page: any) => JSX.Element;
};
