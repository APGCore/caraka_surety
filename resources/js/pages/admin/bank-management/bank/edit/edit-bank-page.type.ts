import React from "react";

interface BankEditProps {
  bank: any;
}

export type BankEditPageProps = React.FC<BankEditProps> & {
  layout?: (page: any) => JSX.Element;
  bank: any;
};
