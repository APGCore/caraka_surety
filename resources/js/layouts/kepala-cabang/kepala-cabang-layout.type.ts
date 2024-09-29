import { User } from "@/types";
import React from "react";

export interface KepalaCabangLayoutProps extends React.PropsWithChildren {
  user: User;
}

export type KepalaCabangLayoutPageProps = React.FC<KepalaCabangLayoutProps>;
