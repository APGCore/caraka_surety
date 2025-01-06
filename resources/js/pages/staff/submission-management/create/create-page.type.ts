import React from "react";

interface SubmissionCreateProps {
  question: string;
  name: string;
  scoringOptions: ScoringOptions[];
  scoringCategories: ScoringCategories;
  scoringQuestions: ScoringQuestions;
  required_doc_id: any;
  id: any;
}

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
  postal_code: string;
  telephone: number | string | undefined;
  fax: string;
  npwp: number | string | undefined;
  nib: number | string | undefined;
  siup_siujk: string;
  head_name: string;
  director_name: string;
  director_position: string;
  director_phone: number | string | undefined;
  commissioner: string;
  year_established?: number | string | undefined;
  last_deed: string;
  business_fields: string;
  documents: Document[]; // Adjust `any` to a more specific type if needed
  ratios: Ratio[]; // Adjust `any` to a more specific type if needed
};

type Submission = {
  guarantor_id: string;
  product_id?: number | string | undefined;
  guarantor_to_product_type_id: string;
  obligee_id: string;
  bank_id: string;
  contract_doc_name: string;
  contract_doc_number: string;
  contract_doc_date?: Date;
  contract_value?: string;
  guarantee_value?: string;
  time_period: string;
  start_date?: Date;
  end_date?: Date;
  job_name: string;
  job_location_province_id: string;
  job_location_regency_id: string;
  job_location_district_id: string;
  job_location_village: string;
  job_location_address: string;
  job_location_postal_code: string;
  source_of_fund_id: string;
  note: string;

  // NEW DATA
  guarantor_branch_id?: number | string | undefined;
  job_group?: string;
};

type Scoring = {
  id: number;
  note: string;
  min_point: number;
  scores: any[]; // Adjust `any` to a more specific type if needed
};

type Obligee = {
  id?: number | string | undefined;
  name?: string;
  pic?: string;
  address?: string;
  no_ppk?: string;
  telephone?: string;
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
