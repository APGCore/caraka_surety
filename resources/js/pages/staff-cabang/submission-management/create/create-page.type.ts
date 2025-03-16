import React from "react";

interface SubmissionCreateProps {}

export type SubmissionCreatePageProps = React.FC<SubmissionCreateProps> & {
    layout?: (page: any) => JSX.Element;
};
