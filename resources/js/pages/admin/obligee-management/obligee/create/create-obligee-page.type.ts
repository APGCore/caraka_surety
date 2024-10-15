import React from "react";

interface CreateObligeeProps {}

export type CreateObligeePageProps = React.FC<CreateObligeeProps> & {
  layout?: (page: any) => JSX.Element;
};
