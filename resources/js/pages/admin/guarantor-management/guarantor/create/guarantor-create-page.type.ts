import React from "react";

interface GuarantorCreateProps {}

export type GuarantorCreatePageProps = React.FC<GuarantorCreateProps> & {
    layout?: (page: any) => JSX.Element;
};
