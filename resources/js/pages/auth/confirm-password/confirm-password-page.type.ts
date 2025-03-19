import React from "react";

interface ConfirmPasswordProps {}

export type ConfirmPasswordPageProps = React.FC<ConfirmPasswordProps> & {
  layout?: (page: any) => JSX.Element;
};
