import React from "react";

interface PrincipalEditProps {
    principal: any;
    provinces: any;
    regencies?: any;
    districts?: any;
}

export type PrincipalEditPageProps = React.FC<PrincipalEditProps> & {
    layout?: (page: any) => JSX.Element;
    principal: any;
    provinces: any;
    regencies?: any;
    districts?: any;
};
