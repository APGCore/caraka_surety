import { PageProps } from "@/types";
import React from "react";

interface MarketingPartnerOfficeCreateProps extends PageProps {}

export type MarketingPartnerOfficeCreatePageProps = React.FC<MarketingPartnerOfficeCreateProps> & {
    layout?: (page: any) => JSX.Element;
};
