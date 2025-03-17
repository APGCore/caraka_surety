import React from "react";

interface AdminScoringsProps {
  scorings: any;
}

export type AdminScoringsPageProps = React.FC<AdminScoringsProps> & {
  layout?: (page: any) => JSX.Element;
};
