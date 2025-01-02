import { PageProps } from "@/types";
import React from "react";

interface PrimaryOfficeProps extends PageProps {
  profiles: any;
}

export type PrimaryOfficePageProps = React.FC<PrimaryOfficeProps> & {
  layout?: (page: any) => JSX.Element;
};
