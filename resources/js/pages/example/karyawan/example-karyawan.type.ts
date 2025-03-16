import { PageProps, User } from "@/types";
import React from "react";

interface ExampleKaryawanProps extends PageProps {
    users: {
        data: User[];
        links: any;
        meta: any;
        roles: any;
    };
}

export type ExampleKaryawanPageProps = React.FC<ExampleKaryawanProps> & {
    layout?: (page: any) => JSX.Element;
};
