import React from "react";

interface AdminEditProductProps {
    product: any;
    product_types: any;
}

export type AdminEditProductPageProps = React.FC<AdminEditProductProps> & {
    layout?: (page: any) => JSX.Element;
};
