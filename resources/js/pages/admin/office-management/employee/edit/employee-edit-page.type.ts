import React from "react";

interface EmployeeEditProps {
  officeSelected: number;
  roles: any;
  managers: any;
  employee: any;
}

export type EmployeePageEditProps = React.FC<EmployeeEditProps> & {
  layout?: (page: any) => JSX.Element;
};
