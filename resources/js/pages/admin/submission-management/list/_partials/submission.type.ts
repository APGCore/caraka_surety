import React from "react";

interface SubmissionProps {
  submissions: any;
  guarantors: any;
  guarantorSelected: number;
  products: any;
  productSelected: number;
  productTypes: any;
  productTypeSelected: number;
}

export type SubmissionPageProps = React.FC<SubmissionProps> & {
  layout?: (page: any) => JSX.Element;
};
