import React from "react";

interface DocumentFormatProps {
  guarantors: any;
  guarantorSelected: number;
  products: any;
  productSelected: any;
  guarantorProductTypes: any;
  guarantorProductTypeSelected: any;
  documentFormats: any;
}

export type DocumentFormatPageProps = React.FC<DocumentFormatProps> & {
  layout?: (page: any) => JSX.Element;
};
