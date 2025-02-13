import { Roles } from "@/common/types/roles";
import { User } from "@/types";
import React from "react";

export interface AdminLayoutProps extends React.PropsWithChildren {
  user: User;
  roles: Roles;
}

export type AdminLayoutPageProps = React.FC<AdminLayoutProps>;
