import { Roles } from "@/common/types/roles";
import { User } from "@/types";
import React from "react";

export interface MarketingLayoutProps extends React.PropsWithChildren {
  user: User;
  roles: Roles;
}

export type MarketingLayoutPageProps = React.FC<MarketingLayoutProps>;
