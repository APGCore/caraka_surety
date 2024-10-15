import React from "react";

interface CreateBankProps {}

export type CreateBankPageProps = React.FC<CreateBankProps> & {
  layout?: (page: any) => JSX.Element;
};
