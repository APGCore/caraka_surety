import React from "react";

interface BranchBankEditProps {
  branch: any;
}

export type BranchBankEditPageProps = React.FC<BranchBankEditProps> & {
  layout?: (page: any) => JSX.Element;
};
