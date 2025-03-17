import React from "react";

interface EmployeeProps {
    // officeTypes: any;
    // officeTypeSelected: number;
    // offices: any;
    office_selected: number;
    employees: any;
    route_name: string;
}

export type EmployeePageProps = React.FC<EmployeeProps> & {
    layout?: (page: any) => JSX.Element;
};
