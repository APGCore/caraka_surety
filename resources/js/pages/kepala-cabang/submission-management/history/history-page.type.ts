import { SubmissionStatus } from "@/types/submission-status";
import React from "react";

interface SubmissionHistoryProps {
  submissions: any[];
  status: SubmissionStatus;
  statusSelected: string;
  offices: any;
  officeTypes: any;
  officeSelected: any;
  officeTypeSelected: any;
}

export type SubmissionHistoryPageProps = React.FC<SubmissionHistoryProps> & {
  layout?: (page: any) => JSX.Element;
};
