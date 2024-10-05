import React from "react";

interface PengajuanProps {}

export type PengajuanPageProps = React.FC<PengajuanProps> & {
  layout?: (page: any) => JSX.Element;
};
