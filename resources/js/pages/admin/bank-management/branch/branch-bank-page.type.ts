import React from "react";

interface BranchBankProps {
  banks: any;
  bank: any;
}

export type BranchBankPageProps = React.FC<BranchBankProps> & {
  layout?: (page: any) => JSX.Element;
};
