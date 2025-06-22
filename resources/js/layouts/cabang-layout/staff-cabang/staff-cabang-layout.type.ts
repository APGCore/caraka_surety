import { Roles } from "@/common/types/roles";
import { User } from "@/types";
import React from "react";

export interface StaffCabangLayoutProps extends React.PropsWithChildren {
  user: User;
  roles: Roles;
  guarantor: any | null;
}

export type StaffCabangLayoutPageProps = React.FC<StaffCabangLayoutProps>;
