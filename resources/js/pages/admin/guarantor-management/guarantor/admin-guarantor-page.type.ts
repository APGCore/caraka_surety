import React from "react";

interface AdminGuarantorProps {
  guarantors: any;
}

export type AdminGuarantorPageProps = React.FC<AdminGuarantorProps> & {
  layout?: (page: any) => JSX.Element;
};
