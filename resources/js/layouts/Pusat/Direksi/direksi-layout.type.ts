import { User } from "@/types";
import React from "react";

export interface DireksiLayoutProps extends React.PropsWithChildren {
  user: User;
}

export type DireksiLayoutPageProps = React.FC<DireksiLayoutProps>;
