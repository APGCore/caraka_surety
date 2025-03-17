import React from "react";

interface BranchGuarantorCreateProps {
    guarantor: any;
}

export type BranchGuarantorCreatePageProps = React.FC<BranchGuarantorCreateProps> & {
    layout?: (page: any) => JSX.Element;
};
