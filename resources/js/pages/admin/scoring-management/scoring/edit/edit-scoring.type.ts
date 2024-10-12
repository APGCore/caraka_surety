import React from "react";

interface AdminEditScoringTypeProps {
  scoring: any;
}

export type AdminEditScoringPageProps = React.FC<AdminEditScoringTypeProps> & {
  layout?: (page: any) => JSX.Element;
};
