import React from "react";

interface InvoiceProps {
  submissions: any;
  submissionIds: any[];
  offices: any;
  officeTypes: any;
  officeSelected: number;
  officeTypeSelected: string;
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
