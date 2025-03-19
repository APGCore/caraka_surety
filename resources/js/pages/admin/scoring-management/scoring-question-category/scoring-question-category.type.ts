import React from "react";

interface AdminScoringQuestionCategoryProps {
  scoringQuestionCategories: any;
  initialSelectedScoring: any;
}

export type AdminScoringQuestionCategoryPropsPageProps = React.FC<AdminScoringQuestionCategoryProps> & {
  layout?: (page: any) => JSX.Element;
};
