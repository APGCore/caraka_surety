import React from "react";

interface CreateBankProps {
  obligees: any[];
  provinces: any;
  regencies?: any;
  districts?: any;
}

export type CreateBankPageProps = React.FC<CreateBankProps> & {
  layout?: (page: any) => JSX.Element;
};
