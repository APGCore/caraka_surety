import React from "react";

interface BankEditProps {
  bank: any;
  provinces: any;
  regencies?: any;
  districts?: any;
}

export type BankEditPageProps = React.FC<BankEditProps> & {
  layout?: (page: any) => JSX.Element;
  bank: any;
  provinces: any;
  regencies?: any;
  districts?: any;
};
