import { PageProps } from "@/types";
import React from "react";

interface BranchOfficeProps extends PageProps {
    profiles: any;
}

export type BranchOfficePageProps = React.FC<BranchOfficeProps> & {
    layout?: (page: any) => JSX.Element;
};
