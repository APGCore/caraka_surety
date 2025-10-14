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
  filters: {
    search: string;
    date: string[];
    years: { id: number, value: number; text: string }[];
    months: { id: number, value: number; text: string }[];
    periods: { id: number, value: number; text: string }[];
  },
  dates: {
    year: number;
    month: number;
    period: number;
  }
}

export type SubmissionPageProps = React.FC<SubmissionProps> & {
  layout?: (page: any) => JSX.Element;
};
