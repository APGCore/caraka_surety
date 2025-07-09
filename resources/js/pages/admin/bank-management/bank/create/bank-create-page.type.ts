import React from "react";

interface BankCreateProps {}

export type BankCreatePageProps = React.FC<BankCreateProps> & {
  layout?: (page: any) => JSX.Element;
};
