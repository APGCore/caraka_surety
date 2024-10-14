import React from "react";

interface BlankProps {
  guarantors: any;
  guarantorSelected: number;
  employees: any;
}

export type BlankPageProps = React.FC<BlankProps> & {
  layout?: (page: any) => JSX.Element;
};
