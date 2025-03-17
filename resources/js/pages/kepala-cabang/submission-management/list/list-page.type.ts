import React from "react";

interface SubmissionListProps {
    submissions: any[];
}

export type SubmissionListPageProps = React.FC<SubmissionListProps> & {
    layout?: (page: any) => JSX.Element;
};
