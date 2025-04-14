import React from "react";

interface SubmissionCreateProps {
  guarantor: any;
  submission?: SubmissionFormProps;
}

export type SubmissionCreatePageProps = React.FC<SubmissionCreateProps> & {
  layout?: (page: any) => JSX.Element;
};

type Principal = {
  id: string | null;
  province_id?: string;
  regency_id?: string;
  district_id?: string;
  village: string;
  name: string;
  address: string;
  postal_code: string;
  telephone?: number | string | undefined;
  fax: string;
  npwp?: number | string | undefined;
  nib?: number | string | undefined;
  siup_siujk: string;
  head_name: string;
  director_name: string;
  director_position: string;
  director_phone?: number | string | undefined;
  commissioner: string;
  year_established?: number | string | undefined;
  est_deed: string;
  last_deed: string;
  business_fields: string;
  documents: Document[]; // Adjust `any` to a more specific type if needed
  ratios: Ratio[]; // Adjust `any` to a more specific type if needed
};

type Submission = {
  id?: number | string;
  guarantor_id: string;
  guarantor_branch_id?: number;
  product_id?: number;
  product_type_id: number | null;
  job_group: string;
  job_type: string;
  obligee_id?: number;
  bank_id?: number;
  contract_doc_name: string;
  contract_doc_number: string;
  contract_doc_date?: string | Date | undefined;
  contract_value?: string;
  guarantee_value?: string;
  time_period: string;
  start_date?: string | Date | undefined;
  end_date?: string | Date | undefined;
  job_name: string;
  job_location_province_id?: number;
  job_location_regency_id?: number;
  job_location_district_id?: number;
  job_location_village: string;
  job_location_address: string;
  job_location_postal_code: string;
  source_of_fund_id?: number;
  note: string;
  risk_mitigation: string;
  blank_id?: number;
  revised_note: string | null;
  is_edit?: boolean;
};

type Scoring = {
  id: number;
  note: string;
  min_point: number;
  scores: any[]; // Adjust `any` to a more specific type if needed
};

type Obligee = {
  id?: number;
  name?: string;
  pic?: string;
  no_ppk?: string;
  telephone?: string;
  province_id?: string;
  regency_id?: string;
  district_id?: string;
  village?: string;
  address?: string;
  postal_code?: string;
};

type Document = {
  required_doc_id: number;
  required_doc_name: string;
  file: File;
};

type ScoringCategories = {
  id: number;
  name: string;
  questions: ScoringQuestions[];
};

type ScoringQuestions = {
  id: number;
  name: string;
  options: ScoringOptions[];
};

type ScoringOptions = {
  id: number;
  name: string;
  point: number;
};

export interface Ratio {
  current_assets: string;
  current_debt: string;
  total_debt: string;
  total_assets: string;
  revenue: string;
  net_income: string;
  liquidity_ratios?: string;
  solvency_ratios?: string;
  profitability_ratios?: string;
  year: number;
}

export interface SubmissionFormProps {
  principal: Principal;
  obligee: Obligee;
  submission: Submission;
  scoring: Scoring;
}

export interface ISelectedPrincipalDistrict {
  id: number;
  name: string;
}
