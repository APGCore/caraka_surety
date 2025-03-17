import React from "react";

interface BlankUsageProps {
  blankUsage: any;
}

export type BlankUsagePageProps = React.FC<BlankUsageProps> & {
  layout?: (page: any) => JSX.Element;
};
