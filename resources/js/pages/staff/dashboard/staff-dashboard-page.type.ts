import React from "react";

interface StaffDashboardProps {}

export type StaffDashboardPageProps = React.FC<StaffDashboardProps> & {
  layout?: (page: any) => JSX.Element;
};
