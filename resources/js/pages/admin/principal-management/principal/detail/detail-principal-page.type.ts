import React from "react";

interface PrincipalDetailProps {
  principal: any;
}

export type PrincipalDetailPageProps = React.FC<PrincipalDetailProps> & {
  layout?: (page: any) => JSX.Element;
};
