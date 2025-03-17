import React from "react";

interface AdminScoringQuestionProps {
    scoringQuestions: any;
    initialSelectedScoring: any;
    initialSelectedScoringQuestionCategory: any;
}

export type AdminScoringQuestionCategoryPropsPageProps = React.FC<AdminScoringQuestionProps> & {
    layout?: (page: any) => JSX.Element;
};
