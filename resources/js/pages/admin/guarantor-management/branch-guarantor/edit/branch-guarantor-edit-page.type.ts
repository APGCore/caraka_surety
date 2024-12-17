import React from "react";

interface BranchGuarantorEditProps {
  guarantor: any;
  branchGuarantor: any;
}

export type BranchGuarantorEditPageProps = React.FC<BranchGuarantorEditProps> & {
  layout?: (page: any) => JSX.Element;
};
