import React from "react";

interface AdminEditProductTypeProps {
    productType: any;
}

export type AdminEditProductTypePageProps = React.FC<AdminEditProductTypeProps> & {
    layout?: (page: any) => JSX.Element;
};
