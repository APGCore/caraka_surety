import React from "react";

interface BlankProps {
  blanks: Array<any>;
  blanks_un_approved: Array<any>;
  links: any;
  guarantors: any;
  guarantorSelected: any;
}

export type BlankPageProps = React.FC<BlankProps> & {
  layout?: (page: any) => JSX.Element;
};
