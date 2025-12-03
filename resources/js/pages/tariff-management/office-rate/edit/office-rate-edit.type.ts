import React from "react";

interface OfficeRateEditProps {
  profileRate: any;
}

export type OfficeRateEditPageProps = React.FC<OfficeRateEditProps> & {
  layout?: (page: any) => JSX.Element;
};
