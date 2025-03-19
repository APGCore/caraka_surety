import React from "react";

interface SubmissionHistoryProps {
  submissions: any[];
}

export type SubmissionHistoryPageProps = React.FC<SubmissionHistoryProps> & {
  layout?: (page: any) => JSX.Element;
};
