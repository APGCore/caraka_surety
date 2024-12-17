import React from "react";

interface BranchGuarantorProps {
  guarantor: any;
  branchGuarantors: any;
}

export type BranchGuarantorPageProps = React.FC<BranchGuarantorProps> & {
  layout?: (page: any) => JSX.Element;
};
