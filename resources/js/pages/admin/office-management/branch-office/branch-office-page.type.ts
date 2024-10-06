import React from "react";

interface BranchOfficeProps {}

export type BranchOfficePageProps = React.FC<BranchOfficeProps> & {
  layout?: (page: any) => JSX.Element;
  profiles: any;
};
