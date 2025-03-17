import React from "react";

interface BlankProps {
  guarantors: any;
  guarantorBranches: any;
  guarantorSelected: number;
  guarantorBranchSelected: number;
  blanks: any;
}

export type BlankPageProps = React.FC<BlankProps> & {
  layout?: (page: any) => JSX.Element;
};
