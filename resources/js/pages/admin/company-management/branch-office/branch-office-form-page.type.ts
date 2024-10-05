import React from "react";

interface BranchOfficeFormProps {
  profile?: any;
  provinces: any;
  regencies?: any;
  districts?: any;
}

export type BranchOfficeFormPageProps = React.FC<BranchOfficeFormProps> & {
  layout?: (page: any) => JSX.Element;
  profile?: any;
  provinces: any;
  regencies?: any;
  districts?: any;
};
