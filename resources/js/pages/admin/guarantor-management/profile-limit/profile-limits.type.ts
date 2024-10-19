import React from "react";

interface ProfileLimitsProps {
  guarantors: any;
  guarantorSelected: number;
  profiles: any;
}

export type ProfileLimitsPageProps = React.FC<ProfileLimitsProps> & {
  layout?: (page: any) => JSX.Element;
};
