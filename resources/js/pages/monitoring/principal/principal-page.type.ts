import React from "react";

interface PrincipalMonitoringProps {
  principals: any;
}

export type PrincipalPageProps = React.FC<PrincipalMonitoringProps> & {
  layout?: (page: any) => JSX.Element;
};
