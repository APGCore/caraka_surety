import React from "react";

interface AdminEditScoringQuestionOptionProps {
  scoringOptions: any;
  selectedScoringQuestion: any;
}

export type AdminEditScoringQuestionOptionPageProps = React.FC<AdminEditScoringQuestionOptionProps> & {
  layout?: (page: any) => JSX.Element;
};
