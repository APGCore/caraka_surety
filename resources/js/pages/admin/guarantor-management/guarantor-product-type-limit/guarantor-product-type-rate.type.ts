import React from "react";

interface GuarantorProductTypeRateProps {
    guarantors: any;
    guarantorSelected: any;
    products: any;
    productSelected: any;
    jobGroups: any;
    jobGroupSelected: any;
    jobTypes: any;
    jobTypeSelected: any;
    guarantorProductTypes: any;
}

export type GuarantorProductTypeRatePageProps = React.FC<GuarantorProductTypeRateProps> & {
    layout?: (page: any) => JSX.Element;
};
