import { SubmissionStatus } from "@/types/submission-status";
import React from "react";

interface SubmissionProps {
  submissions: any[];
  status: SubmissionStatus;
  statusSelected: string;
  offices: any;
  officeTypes: any;
  officeSelected: any;
  officeTypeSelected: any;
}

export type SubmissionPageProps = React.FC<SubmissionProps> & {
  layout?: (page: any) => JSX.Element;
};
