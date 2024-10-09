import React from "react";

interface ObligeeManagementProps {
  obligees: any[];
}

export type ObligeeManagementPageProps = React.FC<ObligeeManagementProps> & {
  layout?: (page: any) => JSX.Element;
};
