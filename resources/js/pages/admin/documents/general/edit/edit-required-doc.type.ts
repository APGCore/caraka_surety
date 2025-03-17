import React from "react";

interface AdminEditDocumentReqProps {
  reqDoc: any;
  productType: any[];
}

export type AdminEditDocumentReqPageProps = React.FC<AdminEditDocumentReqProps> & {
  layout?: (page: any) => JSX.Element;
};
