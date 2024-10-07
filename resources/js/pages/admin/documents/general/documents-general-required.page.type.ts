import React from "react";

interface DocumentGeneralPage {
  productTypes: any[];
  reqDocs: any[];
}

export type DocumentGeneralPageProps = React.FC<DocumentGeneralPage> & {
  layout?: (page: any) => JSX.Element;
};
