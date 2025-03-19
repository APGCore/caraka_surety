import React from "react";

interface EmployeeEditProps {
  officeSelected: number;
  role?: any;
  roles: any;
  headers: any;
  employee: any;
  routeName: any;
}

export type EmployeePageEditProps = React.FC<EmployeeEditProps> & {
  layout?: (page: any) => JSX.Element;
};
