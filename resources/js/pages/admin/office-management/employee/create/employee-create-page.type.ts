import { Roles } from "@/_features/_common/types/roles";
import React from "react";

interface EmployeeCreateProps {
  auth: any;
  officeSelected: number;
  isHeadquarter: boolean;
  roles: any;
  roles_names: Roles;
  headers: any;
  routeName: any;
}

export type EmployeePageCreateProps = React.FC<EmployeeCreateProps> & {
  layout?: (page: any) => JSX.Element;
};
