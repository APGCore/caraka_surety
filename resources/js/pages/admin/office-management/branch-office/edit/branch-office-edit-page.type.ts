import React from "react";

interface BranchOfficeEditProps {
  profile: any;
  provinces: any;
  regencies?: any;
  districts?: any;
}

export type BranchOfficeEditPageProps = React.FC<BranchOfficeEditProps> & {
  layout?: (page: any) => JSX.Element;
  profile: any;
  provinces: any;
  regencies?: any;
  districts?: any;
};
