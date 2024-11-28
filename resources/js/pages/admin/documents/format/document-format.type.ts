import React from "react";

interface ProfileLimitsProps {
  guarantors: any;
  guarantorSelected: number;
  guarantorProducts: any;
  guarantorProductSelected: any;
  guarantorProductTypes: any;
  guarantorProductTypeSelected: any;
  profiles: any;
}

export type ProfileLimitsPageProps = React.FC<ProfileLimitsProps> & {
  layout?: (page: any) => JSX.Element;
};
