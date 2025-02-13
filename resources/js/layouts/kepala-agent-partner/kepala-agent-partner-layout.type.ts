import { Roles } from "@/common/types/roles";
import { User } from "@/types";
import React from "react";

export interface KepalaCabangLayoutProps extends React.PropsWithChildren {
  user: User;
  roles: Roles;
}

export type KepalaAgentPartnerLayoutPageProps = React.FC<KepalaCabangLayoutProps>;
