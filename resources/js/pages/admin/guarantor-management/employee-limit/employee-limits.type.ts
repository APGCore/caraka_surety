import React from "react";

interface EmployeeLimitsProps {
  guarantors: any;
  guarantorSelected: number;
  guarantorProducts: any;
  guarantorProductSelected: number;
  guarantorProductTypes: any;
  guarantorProductTypeSelected: number;
  profiles: any;
  profileSelected: number;
  officeTypes: any;
  officeTypeSelected: any;
  limit: any;
  employees: any;
}

export type EmployeeLimitsPageProps = React.FC<EmployeeLimitsProps> & {
  layout?: (page: any) => JSX.Element;
};
