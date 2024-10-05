import React from "react";

interface AdminProductsProps {
  products: any;
}

export type AdminProductsPageProps = React.FC<AdminProductsProps> & {
  layout?: (page: any) => JSX.Element;
};
