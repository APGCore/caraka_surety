import React from "react";

interface RegisterProps {}

export type RegisterPageProps = React.FC<RegisterProps> & {
    layout?: (page: any) => JSX.Element;
};
