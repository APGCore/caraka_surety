import { User } from "@/types";
import React from "react";

export interface StaffCabangLayoutProps extends React.PropsWithChildren {
  user: User;
}

export type StaffCabangLayoutPageProps = React.FC<StaffCabangLayoutProps>;
