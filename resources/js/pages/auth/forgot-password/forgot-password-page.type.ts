import React from "react";

interface ForgotPasswordProps {
  status?: string;
}

export type ForgotPasswordPageProps = React.FC<ForgotPasswordProps> & {
  layout?: (page: any) => JSX.Element;
};
