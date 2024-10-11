import React from "react";

interface BankManagementProps {
  banks: any;
}

export type BankManagementPageProps = React.FC<BankManagementProps> & {
  layout?: (page: any) => JSX.Element;
};
