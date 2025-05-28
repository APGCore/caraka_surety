import { Roles } from "@/_features/_common/types/roles";
import React from "react";

interface EmployeeEditProps {
  officeSelected: number;
  roles: any;
  roles_names: Roles;
  headers: any;
  employee: any;
  routeName: any;
}

export type EmployeePageEditProps = React.FC<EmployeeEditProps> & {
  layout?: (page: any) => JSX.Element;
};
