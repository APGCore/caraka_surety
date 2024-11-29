import React from "react";

interface CreateDocumentFormatProps {
  guarantors: any;
  guarantorSelected: number;
  products: any;
  productSelected: any;
  guarantorProductTypes: any;
  guarantorProductTypeSelected: any;
}

export type CreateDocumentFormatPageProps = React.FC<CreateDocumentFormatProps> & {
  layout?: (page: any) => JSX.Element;
};
