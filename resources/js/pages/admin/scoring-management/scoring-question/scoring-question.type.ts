import React from "react";

interface AdminScoringQuestionProps {
  scorings: any;
}

export type AdminScoringQuestionCategoryPropsPageProps = React.FC<AdminScoringQuestionProps> & {
  layout?: (page: any) => JSX.Element;
};
