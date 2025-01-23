import React from "react";

interface InvoiceProps {
  submissions: any;
}

export type InvoicePageProps = React.FC<InvoiceProps> & {
  layout?: (page: any) => JSX.Element;
};
