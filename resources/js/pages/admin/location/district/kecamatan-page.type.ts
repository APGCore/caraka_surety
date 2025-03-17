import React from "react";

interface DistrictProps {}

export type DistrictPageProps = React.FC<DistrictProps> & {
    layout?: (page: any) => JSX.Element;
    regencies: any;
    districts: any;
};
