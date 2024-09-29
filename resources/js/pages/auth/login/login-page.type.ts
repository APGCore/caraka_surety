import React from "react";

interface LoginProps {
  status?: string;
  canResetPassword?: boolean;
}

export type LoginPageProps = React.FC<LoginProps> & {
  layout?: (page: any) => JSX.Element;
};
