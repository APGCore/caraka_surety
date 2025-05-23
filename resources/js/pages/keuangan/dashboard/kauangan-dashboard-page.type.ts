import React from "react";

interface KeuanganDashboardProps {
  products: any[];
}

export type KeuanganDashboardPageProps = React.FC<KeuanganDashboardProps> & {
  layout?: (page: any) => JSX.Element;
};
