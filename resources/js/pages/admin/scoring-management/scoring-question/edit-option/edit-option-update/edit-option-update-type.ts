import React from "react";

interface AdminEditScoringQuestionOptionEditProps {
    scoringOption: any;
    selectedScoringQuestion: any;
}

export type AdminEditScoringQuestionOptionEditPageProps = React.FC<AdminEditScoringQuestionOptionEditProps> & {
    layout?: (page: any) => JSX.Element;
};
