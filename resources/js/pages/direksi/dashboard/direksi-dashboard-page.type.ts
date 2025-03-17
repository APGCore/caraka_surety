import React from "react";

interface DireksiDashboardProps {
    total_submission: number;
    total_submission_process: number;
    total_submission_approved: number;
    total_submission_rejected: number;
    products: any[];
    graph_data: any[];
    submissions: any[];
}

export type DireksiDashboardPageProps = React.FC<DireksiDashboardProps> & {
    layout?: (page: any) => JSX.Element;
};
