import { OfficeType } from "@/_features/office/services/office-query";
import { PageProps } from "@/types";
import React from "react";

interface BranchOfficeProps extends PageProps {
  officeType: OfficeType;
  profiles?: {
    data?: any;
    meta?: any;
  };
}

export type BranchOfficePageProps = React.FC<BranchOfficeProps> & {
  layout?: (page: any) => JSX.Element;
};
