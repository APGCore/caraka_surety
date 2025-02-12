import React from "react";

interface KepalaCabangDashboardProps {}

export type KepalaCabangDashboardPageProps = React.FC<KepalaCabangDashboardProps> & {
  layout?: (page: any) => JSX.Element;
};
