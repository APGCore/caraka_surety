import React from "react";

interface ProductGuarantorProps {
  guarantors: any;
  products: any;
  jobGroups: any;
  jobTypes: any;
}

export type ProductGuarantorPageProps = React.FC<ProductGuarantorProps> & {
  layout?: (page: any) => JSX.Element;
};
