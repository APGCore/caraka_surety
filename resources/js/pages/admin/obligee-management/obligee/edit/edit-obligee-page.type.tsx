import React from "react";

interface ObligeeEditProps {
  obligee: any;
  provinces: any;
  regencies?: any;
  districts?: any;
}

export type ObligeeEditPageProps = React.FC<ObligeeEditProps> & {
  layout?: (page: any) => JSX.Element;
  obligee: any;
  provinces: any;
  regencies?: any;
  districts?: any;
};
