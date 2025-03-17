import React from "react";

interface Branch {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    usenamer: string;
}

export interface AdminDashboardProps {
    totalPremi?: number;
    totalSubmission?: number;
    totalUsedBlank?: number;
    process: number;
    approved: number;
    rejected: number;
    branches?: Branch[];
    countGuarantors: number;
    userApprovedSubmission?: User[];
    graph_data?: any;
    submissions?: any;
}

export type AdminDashboardPageProps = React.FC<AdminDashboardProps> & {
    layout?: (page: any) => JSX.Element;
};
