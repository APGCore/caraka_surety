import React from "react";

interface PrincipalManagementProps {
  principals: any;
}

export type PrincipalManagementPageProps = React.FC<PrincipalManagementProps> & {
  layout?: (page: any) => JSX.Element;
};
