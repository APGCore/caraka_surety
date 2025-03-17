import React from "react";

interface SourceOfFundsProps {
  sourceOfFunds: any;
}

export type SourceOfFundsPageProps = React.FC<SourceOfFundsProps> & {
  layout?: (page: any) => JSX.Element;
};
