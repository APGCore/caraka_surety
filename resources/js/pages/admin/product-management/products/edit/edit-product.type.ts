import React from "react";

interface AdminEditProductProps {
  product: any;
}

export type AdminEditProductPageProps = React.FC<AdminEditProductProps> & {
  layout?: (page: any) => JSX.Element;
};
