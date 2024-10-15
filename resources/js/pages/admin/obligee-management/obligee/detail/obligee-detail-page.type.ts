import React from "react";

interface ObligeeDetailProps {
  obligee: any;
}

export type ObligeeDetailPageProps = React.FC<ObligeeDetailProps> & {
  layout?: (page: any) => JSX.Element;
};
