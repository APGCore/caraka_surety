import { User } from "@/types";
import React from "react";

export interface StaffLayoutProps extends React.PropsWithChildren {
  user: User;
}

export type StaffLayoutPageProps = React.FC<StaffLayoutProps>;
