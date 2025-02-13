import { Roles } from "@/common/types/roles";
import { User } from "@/types";
import React from "react";

export interface DireksiLayoutProps extends React.PropsWithChildren {
  user: User;
  roles: Roles;
}

export type DireksiLayoutPageProps = React.FC<DireksiLayoutProps>;
