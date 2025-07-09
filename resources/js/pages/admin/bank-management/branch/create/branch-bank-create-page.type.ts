import React from "react";

interface BranchBankCreateProps {
  bank: any;
}

export type BranchBankCreatePageProps = React.FC<BranchBankCreateProps> & {
  layout?: (page: any) => JSX.Element;
};
