import React from "react";

interface VerifyEmailProps {
  status?: string;
}

export type VerifyEmailPageProps = React.FC<VerifyEmailProps> & {
  layout?: (page: any) => JSX.Element;
};
