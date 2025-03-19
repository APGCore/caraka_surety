import React from "react";

interface BankDetailProps {
  bank: any;
}

export type BankDetailPageProps = React.FC<BankDetailProps> & {
  layout?: (page: any) => JSX.Element;
};
