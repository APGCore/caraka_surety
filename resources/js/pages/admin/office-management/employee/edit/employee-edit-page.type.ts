import { Roles } from "@/_features/_common/types/roles";
import React from "react";

interface EmployeeEditProps {
  auth: any;
  officeSelected: number;
  isHeadquarter: boolean;
  officeType: string;
  roles: any;
  roles_names: Roles;
  headers: any;
  employee: any;
  routeName: any;
}

export type EmployeePageEditProps = React.FC<EmployeeEditProps> & {
  layout?: (page: any) => JSX.Element;
};
