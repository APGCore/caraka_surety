import React from "react";

interface ProvinceProps {}

export type ProvincePageProps = React.FC<ProvinceProps> & {
  layout?: (page: any) => JSX.Element;
  provinces: any;
};
