import React from "react";

interface StaffTeknikDashboardProps {
  total_submission: number;
  total_submission_process: number;
  total_submission_approved: number;
  total_submission_rejected: number;
  products: any[];
  graph_data: any[];
  submissions: any[];
}

export type StaffTeknikDashboardPageProps = React.FC<StaffTeknikDashboardProps> & {
  layout?: (page: any) => JSX.Element;
};
