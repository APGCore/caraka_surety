import React from "react";

interface SubmissionListProps {
  submissions: any[];
  offices: any;
  officeTypes: any;
  officeSelected: any;
  officeTypeSelected: any;
}

export type SubmissionListPageProps = React.FC<SubmissionListProps> & {
  layout?: (page: any) => JSX.Element;
};
