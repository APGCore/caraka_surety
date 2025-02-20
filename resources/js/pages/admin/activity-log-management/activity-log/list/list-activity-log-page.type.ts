import React from "react";

interface ListActivityLogProps {
  activitylogs: any;
}

export type ListActivityPageProps = React.FC<ListActivityLogProps> & {
  layout?: (page: any) => JSX.Element;
};
