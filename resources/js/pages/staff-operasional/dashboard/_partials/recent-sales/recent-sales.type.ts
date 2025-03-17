import React from "react";

interface RecentSalesProps {
  submissions: any[];
}

export type RecentSalesPageProps = React.FC<RecentSalesProps> & {
  layout?: (page: any) => JSX.Element;
};
