import { PageProps } from "@/types";
import React from "react";

interface AgentPartnerOfficeProps extends PageProps {
    profiles: any;
}

export type AgentPartnerOfficePageProps = React.FC<AgentPartnerOfficeProps> & {
    layout?: (page: any) => JSX.Element;
};
