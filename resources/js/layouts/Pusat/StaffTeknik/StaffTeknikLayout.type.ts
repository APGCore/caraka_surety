import { User } from "@/types";
import React from "react";

export interface StaffTeknikLayoutProps extends React.PropsWithChildren {
  user: User;
}

export type StaffTeknikLayoutPageProps = React.FC<StaffTeknikLayoutProps>;
