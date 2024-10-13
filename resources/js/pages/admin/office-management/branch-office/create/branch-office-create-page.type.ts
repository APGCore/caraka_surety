import React from "react";

interface BranchOfficeCreateProps {}

export type BranchOfficeCreatePageProps = React.FC<BranchOfficeCreateProps> & {
  layout?: (page: any) => JSX.Element;
};
