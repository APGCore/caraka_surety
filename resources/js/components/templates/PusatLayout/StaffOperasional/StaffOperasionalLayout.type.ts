import { User } from "@/types";
import React from "react";

export interface StaffOperasionalLayoutProps extends React.PropsWithChildren {
  user: User;
}

export type StaffOperasionalLayoutPageProps = React.FC<StaffOperasionalLayoutProps>;
