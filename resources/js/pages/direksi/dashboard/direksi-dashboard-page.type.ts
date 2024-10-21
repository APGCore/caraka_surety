import React from "react";

interface DireksiDashboardProps {}

export type DireksiDashboardPageProps = React.FC<DireksiDashboardProps> & {
  layout?: (page: any) => JSX.Element;
};
