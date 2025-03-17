import React from "react";

interface RegencyProps {}

export type RegencyPageProps = React.FC<RegencyProps> & {
    layout?: (page: any) => JSX.Element;
    provinces: any;
    regencies: any;
};
