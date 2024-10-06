import React from "react";

interface PengajuanDetailProps {
  submission: any[];
  status: any;
}

export type PengajuanDetailPageProps = React.FC<PengajuanDetailProps> & {
  layout?: (page: any) => JSX.Element;
};
