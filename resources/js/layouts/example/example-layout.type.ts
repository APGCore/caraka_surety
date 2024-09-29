import { User } from "@/types";
import React from "react";

export interface ExampleLayoutProps extends React.PropsWithChildren {
  user: User;
}

export type ExampleLayoutPageProps = React.FC<ExampleLayoutProps>;
