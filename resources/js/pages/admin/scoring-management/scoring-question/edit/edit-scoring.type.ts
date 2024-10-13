import React from "react";

interface AdminEditScoringQuestionProps {
  scoringQuestion: any;
}

export type AdminEditScoringQuestionPageProps = React.FC<AdminEditScoringQuestionProps> & {
  layout?: (page: any) => JSX.Element;
};
