import React from "react";

interface ObligeeEditProps {
    obligee: any;
}

export type ObligeeEditPageProps = React.FC<ObligeeEditProps> & {
    layout?: (page: any) => JSX.Element;
    obligee: any;
};
