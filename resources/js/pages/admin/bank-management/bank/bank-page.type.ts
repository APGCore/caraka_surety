import React from "react";

interface BankProps {
  banks: any;
}

export type BankPageProps = React.FC<BankProps> & {
  layout?: (page: any) => JSX.Element;
};
