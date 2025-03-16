import { PageProps } from "@/types";
import React from "react";

interface BranchOfficeCreateProps extends PageProps {}

export type BranchOfficeCreatePageProps = React.FC<BranchOfficeCreateProps> & {
    layout?: (page: any) => JSX.Element;
};
