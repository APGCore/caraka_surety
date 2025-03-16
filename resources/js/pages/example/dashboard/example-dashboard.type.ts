import React from "react";

interface ExampleDashboardProps {}

export type ExampleDashboardPageProps = React.FC<ExampleDashboardProps> & {
    layout?: (page: any) => JSX.Element;
};
