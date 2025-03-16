import { PageProps } from "@/types";
import React from "react";

interface AgentPartnerOfficeCreateProps extends PageProps {}

export type AgentPartnerOfficeCreatePageProps = React.FC<AgentPartnerOfficeCreateProps> & {
    layout?: (page: any) => JSX.Element;
};
