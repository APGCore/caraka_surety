import React from "react";

interface ProfileLimitsProps {
    guarantors: any;
    guarantorSelected: number;
    guarantorProducts: any;
    guarantorProductSelected: number;
    guarantorProductTypes: any;
    guarantorProductTypeSelected: number;
    guarantorToProductTypeId: number;
    jobGroups: any;
    jobGroupSelected: string;
    jobTypes: any;
    jobTypeSelected: string;
    officeTypes: any;
    officeTypeSelected: number;
    limit: any;
    profiles: any;
}

export type ProfileLimitsPageProps = React.FC<ProfileLimitsProps> & {
    layout?: (page: any) => JSX.Element;
};
