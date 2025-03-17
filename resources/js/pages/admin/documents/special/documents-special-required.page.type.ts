import React from "react";

interface AdminDashboardProps {}

export type AdminDashboardPageProps = React.FC<AdminDashboardProps> & {
    layout?: (page: any) => JSX.Element;
};
