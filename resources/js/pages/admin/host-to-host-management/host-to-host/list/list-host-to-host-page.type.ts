import React from "react";

interface ListHostToHostProps {
    hostToHosts: any;
}

export type ListHostToHostPageProps = React.FC<ListHostToHostProps> & {
    layout?: (page: any) => JSX.Element;
};
