import React from "react";

interface AdminEditScoringQuestionCategoryProps {
  scoringQuestionCategory: any;
}

export type AdminEditScoringQuestionCategoryPageProps = React.FC<AdminEditScoringQuestionCategoryProps> & {
  layout?: (page: any) => JSX.Element;
};
