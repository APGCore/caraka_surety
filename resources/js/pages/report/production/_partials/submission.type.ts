import React from "react";

interface SubmissionProps {
  submissions: any;
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
  guarantorToProductTypeSelected: number;
}

export type SubmissionPageProps = React.FC<SubmissionProps> & {
  layout?: (page: any) => JSX.Element;
};
