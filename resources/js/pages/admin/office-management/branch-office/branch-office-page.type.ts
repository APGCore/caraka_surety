import React from "react";

interface BranchOfficeProps {
  profiles: any;
}

export type BranchOfficePageProps = React.FC<BranchOfficeProps> & {
  layout?: (page: any) => JSX.Element;
};
