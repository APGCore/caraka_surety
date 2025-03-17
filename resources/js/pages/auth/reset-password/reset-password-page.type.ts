import React from "react";

interface ResetPasswordProps {
    token: string;
    email: string;
}

export type ResetPasswordPageProps = React.FC<ResetPasswordProps> & {
    layout?: (page: any) => JSX.Element;
};
