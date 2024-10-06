import React from "react";

interface EmployeeProps {
  offices: any;
  officeSelected: number;
  employees: any;
}

export type EmployeePageProps = React.FC<EmployeeProps> & {
  layout?: (page: any) => JSX.Element;
};
