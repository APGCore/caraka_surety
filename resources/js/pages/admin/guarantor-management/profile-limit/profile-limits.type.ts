import React from "react";

interface ProfileLimitsProps {
  guarantors: any;
  guarantorSelected: number;
  guarantorProducts: any;
  guarantorProductSelected: any;
  guarantorProductTypes: any;
  guarantorProductTypeSelected: any;
  officeTypes: any;
  officeTypeSelected: any;
  limit: any;
  profiles: any;
}

export type ProfileLimitsPageProps = React.FC<ProfileLimitsProps> & {
  layout?: (page: any) => JSX.Element;
};
