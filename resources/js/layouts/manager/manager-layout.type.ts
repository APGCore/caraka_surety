import { Roles } from "@/common/types/roles";
import { User } from "@/types";
import React from "react";

export interface ManagerLayoutProps extends React.PropsWithChildren {
    user: User;
    roles: Roles;
}

export type ManagerLayoutPageProps = React.FC<ManagerLayoutProps>;
