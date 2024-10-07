import { User } from "@/types";
import React from "react";

export interface ManagerLayoutProps extends React.PropsWithChildren {
  user: User;
}

export type ManagerLayoutPageProps = React.FC<ManagerLayoutProps>;

