import React from "react";

interface GuarantorProps {
    guarantors: any;
}

export type GuarantorPageProps = React.FC<GuarantorProps> & {
    layout?: (page: any) => JSX.Element;
};
