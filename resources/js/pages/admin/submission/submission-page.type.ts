import React from "react";

interface Document {
  name: string;
}

interface ScoringQuestion {
  name: string;
  // Tambahkan properti lain jika ada
}

interface SubmissionProps {
  submissions: any;
  scoringQuestions?: ScoringQuestion;
}

export type SubmissionPageProps = React.FC<SubmissionProps> & {
  layout?: (page: any) => JSX.Element;
};
