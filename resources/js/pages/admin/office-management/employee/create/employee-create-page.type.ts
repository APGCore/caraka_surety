import React from "react";

interface EmployeeCreateProps {
  officeSelected: number;
  roles: any;
  headers: any;
}

export type EmployeePageCreateProps = React.FC<EmployeeCreateProps> & {
  layout?: (page: any) => JSX.Element;
};
