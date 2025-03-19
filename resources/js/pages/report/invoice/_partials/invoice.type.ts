import React from "react";

interface InvoiceProps {
  submissions: any;
  guarantors: any;
  guarantorSelected: number;
  products: any;
  productSelected: number;
  productTypes: any;
  productTypeSelected: number;
}

export type InvoicePageProps = React.FC<InvoiceProps> & {
  layout?: (page: any) => JSX.Element;
};
