import React from "react";

interface BranchOfficeEditProps {
  profile: any;
}

export type BranchOfficeEditPageProps = React.FC<BranchOfficeEditProps> & {
  layout?: (page: any) => JSX.Element;
  profile: any;
};
