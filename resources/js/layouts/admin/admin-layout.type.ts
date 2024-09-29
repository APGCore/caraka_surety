import { User } from "@/types";
import React from "react";

export interface AdminLayoutProps extends React.PropsWithChildren {
  user: User;
}
