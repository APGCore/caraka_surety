import React from "react";

interface SubmissionDocumentDraftProps {
    submissions: any[];
}

export type SubmissionDocumentDraftPageProps = React.FC<SubmissionDocumentDraftProps> & {
    layout?: (page: any) => JSX.Element;
};
