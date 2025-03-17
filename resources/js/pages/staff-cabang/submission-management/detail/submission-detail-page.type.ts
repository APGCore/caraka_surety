import React from "react";

interface SubmissionDetailProps {
    submission: any[];
    status: any;
}

export type SubmissionDetailPageProps = React.FC<SubmissionDetailProps> & {
    layout?: (page: any) => JSX.Element;
};
