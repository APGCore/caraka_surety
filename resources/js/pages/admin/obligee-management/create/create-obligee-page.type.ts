import React from "react";

interface CreateObligeeProps {
  obligees: any[];
  provinces: any;
  regencies?: any;
  districts?: any;
}

export type CreateObligeePageProps = React.FC<CreateObligeeProps> & {
  layout?: (page: any) => JSX.Element;
};
