import React from "react";

interface AdminProductTypesProps {
    productTypes: any;
}

export type AdminProductTypesPageProps = React.FC<AdminProductTypesProps> & {
    layout?: (page: any) => JSX.Element;
};
