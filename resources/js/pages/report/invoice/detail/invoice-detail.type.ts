import React from "react";

interface InvoiceDetailProps {
  submission: any;
  guarantor_rate: any;
  office_rate: any;
  principal_rate: any;
  submission_rate: any;
  is_set: boolean;
}

export type InvoiceDetailPageProps = React.FC<InvoiceDetailProps> & {
  layout?: (page: any) => JSX.Element;
};
