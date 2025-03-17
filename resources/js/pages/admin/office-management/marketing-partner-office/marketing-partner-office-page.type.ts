import { PageProps } from "@/types";
import React from "react";

interface MarketingPartnerOfficeProps extends PageProps {
  profiles: any;
}

export type MarketingPartnerOfficePageProps = React.FC<MarketingPartnerOfficeProps> & {
  layout?: (page: any) => JSX.Element;
};
