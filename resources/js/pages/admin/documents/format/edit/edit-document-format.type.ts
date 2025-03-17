import React from "react";

interface EditDocumentFormatProps {
  guarantors: any;
  guarantorSelected: number;
  products: any;
  productSelected: any;
  guarantorProductTypes: any;
  guarantorProductTypeSelected: any;
  documentFormat: any;
}

export type EditDocumentFormatPageProps = React.FC<EditDocumentFormatProps> & {
  layout?: (page: any) => JSX.Element;
};
