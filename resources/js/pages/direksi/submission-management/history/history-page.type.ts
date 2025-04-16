import React from "react";

interface SubmissionHistoryProps {
  submissions: any[];
  offices: any;
  officeTypes: any;
  officeSelected: any;
  officeTypeSelected: any;
}

export type SubmissionHistoryPageProps = React.FC<SubmissionHistoryProps> & {
  layout?: (page: any) => JSX.Element;
};
