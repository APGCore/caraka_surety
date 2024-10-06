import React from "react";

interface BranchOfficeCreateProps {
  provinces: any;
  regencies?: any;
  districts?: any;
}

export type BranchOfficeCreatePageProps = React.FC<BranchOfficeCreateProps> & {
  layout?: (page: any) => JSX.Element;
  provinces: any;
  regencies?: any;
  districts?: any;
};
