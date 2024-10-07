import React from "react";

interface PengajuanProps {
  submissions: any[];
}

export type PengajuanPageProps = React.FC<PengajuanProps> & {
  layout?: (page: any) => JSX.Element;
};
