import React from "react";

interface KepalaAgentPartnerDashboardProps {
    total_submission: number;
    total_submission_process: number;
    total_submission_approved: number;
    total_submission_rejected: number;
    products: any[];
    graph_data: any[];
    submissions: any[];
}

export type KepalaAgentPartnerDashboardPageProps = React.FC<KepalaAgentPartnerDashboardProps> & {
    layout?: (page: any) => JSX.Element;
};
