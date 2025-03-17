import React from "react";

interface GuarantorEditProps {
    guarantor: any;
}

export type GuarantorEditPageProps = React.FC<GuarantorEditProps> & {
    layout?: (page: any) => JSX.Element;
};
