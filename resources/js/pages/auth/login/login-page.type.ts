import React from "react";

interface LoginProps {
    status?: string;
    canResetPassword?: boolean;
    guarantors: any[];
    guarantorSelected: number;
}

export type LoginPageProps = React.FC<LoginProps> & {
    layout?: (page: any) => JSX.Element;
};
