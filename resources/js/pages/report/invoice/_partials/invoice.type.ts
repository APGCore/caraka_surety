import React from "react";

interface InvoiceProps {
  submissions: any;
  guarantors: any;
  guarantorSelected: number;
}

export type InvoicePageProps = React.FC<InvoiceProps> & {
  layout?: (page: any) => JSX.Element;
};
