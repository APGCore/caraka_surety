import React from "react";

interface StaffDashboardProps {
  total_submission: number;
  total_submission_process: number;
  total_submission_approved: number;
  total_submission_rejected: number;
  products: any[];
  graph_data: any[];
  submissions: any[];
}

export type StaffDashboardPageProps = React.FC<StaffDashboardProps> & {
  layout?: (page: any) => JSX.Element;
};
