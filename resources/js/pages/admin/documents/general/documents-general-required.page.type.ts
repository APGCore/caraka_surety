import React from "react";

type Paginated<T> = {
  data: T[];
  links: {
    url: string | null;
    label: string;
    active: boolean;
  }[];
  from: number | null;
  to: number | null;
  total: number;
  per_page: number;
  current_page: number;
};

interface DocumentGeneralPage {
  productTypes: any[];
  reqDocs: Paginated<any>;
}

export type DocumentGeneralPageProps = React.FC<DocumentGeneralPage> & {
  layout?: (page: any) => JSX.Element;
};
