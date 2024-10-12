import React from "react";

interface AdminScoringQuestionCategoryProps {
  scorings: any;
}

export type AdminScoringQuestionCategoryPropsPageProps = React.FC<AdminScoringQuestionCategoryProps> & {
  layout?: (page: any) => JSX.Element;
};
