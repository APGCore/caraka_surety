import React from "react";

interface InvoiceProps {
  invoices: any;
}

export type InvoicePageProps = React.FC<InvoiceProps> & {
  layout?: (page: any) => JSX.Element;
};
