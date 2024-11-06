import React from "react";

interface SubmissionCreateProps {}

export type SubmissionCreatePageProps = React.FC<SubmissionCreateProps> & {
  layout?: (page: any) => JSX.Element;
};

type Principal = {
  id: string;
  province_id?: string;
  regency_id?: string;
  district_id?: string;
  village: string;
  name: string;
  address: string;
  telephone: number | undefined;
  fax: string;
  npwp: number | undefined;
  nib: number | undefined;
  siup_siujk: string;
  head_name: string;
  director_name: string;
  director_position: string;
  director_phone: number | undefined;
  commissioner: string;
  year_established?: number;
  last_deed: string;
  documents: any[]; // Adjust `any` to a more specific type if needed
};

type Submission = {
  guarantor_id: string;
  product_id: string;
  guarantor_to_product_type_id: string;
  obligee_id: string;
  bank_id: string;
  contract_doc_name: string;
  contract_doc_number: string;
  contract_doc_date?: Date;
  contract_value: string;
  guarantee_value: string;
  time_period: string;
  start_date?: Date;
  end_date?: Date;
  job_location_province_id: string;
  job_location_regency_id: string;
  job_location_district_id: string;
  job_location_village: string;
  source_of_fund_id: string;
  note: string;
};

type Scoring = {
  id: number;
  note: string;
  min_point: number;
  scores: any[]; // Adjust `any` to a more specific type if needed
};

export interface SubmissionFormProps {
  principal: Principal;
  submission: Submission;
  scoring: Scoring;
}
