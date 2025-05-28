import { Roles } from "@/_features/_common/types/roles";
import React from "react";

interface EmployeeCreateProps {
  officeSelected: number;
  roles: any;
  roles_names: Roles;
  headers: any;
  routeName: any;
}

export type EmployeePageCreateProps = React.FC<EmployeeCreateProps> & {
  layout?: (page: any) => JSX.Element;
};
