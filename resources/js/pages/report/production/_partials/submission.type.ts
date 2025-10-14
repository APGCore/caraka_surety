import React from "react";

interface SubmissionProps {
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
  finalReports: any;
  allReports: any;
  mergedReports: any;
}

export type SubmissionPageProps = React.FC<SubmissionProps> & {
  layout?: (page: any) => JSX.Element;
};
