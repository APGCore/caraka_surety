import { Roles } from "@/common/types/roles";
import { User } from "@/types";
import React from "react";

export interface ExampleLayoutProps extends React.PropsWithChildren {
  user: User;
  roles: Roles;
}

export type ExampleLayoutPageProps = React.FC<ExampleLayoutProps>;
