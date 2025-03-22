import React from "react";

interface BranchOfficeEditProps {
  office: any;
}

export type BranchOfficeEditPageProps = React.FC<BranchOfficeEditProps> & {
  layout?: (page: any) => JSX.Element;
  profile?: any;
};
