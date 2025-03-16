import { Roles } from "@/common/types/roles";
import { User } from "@/types";
import React from "react";

export interface StaffOperasionalLayoutProps extends React.PropsWithChildren {
    user: User;
    roles: Roles;
}

export type StaffOperasionalLayoutPageProps = React.FC<StaffOperasionalLayoutProps>;
