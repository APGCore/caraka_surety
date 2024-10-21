import React from "react";

interface ManagerDashboardProps {}

export type ManagerDashboardPageProps = React.FC<ManagerDashboardProps> & {
  layout?: (page: any) => JSX.Element;
};
