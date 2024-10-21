import React from "react";

interface StaffCabangDashboardProps {}

export type StaffCabangDashboardPageProps = React.FC<StaffCabangDashboardProps> & {
  layout?: (page: any) => JSX.Element;
};
