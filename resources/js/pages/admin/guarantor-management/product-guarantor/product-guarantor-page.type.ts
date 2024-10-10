import React from "react";

interface ProductGuarantorProps {
  guarantors: any;
  products: any;
}

export type ProductGuarantorPageProps = React.FC<ProductGuarantorProps> & {
  layout?: (page: any) => JSX.Element;
};
