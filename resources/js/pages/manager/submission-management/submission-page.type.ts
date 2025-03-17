import React from "react";

interface SubmissionProps {
    submissions: any[];
}

export type SubmissionPageProps = React.FC<SubmissionProps> & {
    layout?: (page: any) => JSX.Element;
};
