import { Ratio } from "@/pages/staff/submission-management/create/create-page.type";
import React from "react";

interface Document {
  name: string;
  number: string;
  url: string;
}

interface Score {
  id: number;
  scoring_id: number;
  scoring: any;
  scoring_question_category_id: number;
  scoring_question_category: any;
  scoring_question_id: number;
  scoring_question: any;
  scoring_option_id: number;
  scoring_option: any;
  point: number;
  category_name: string;
  question_name: string;
  option_name: string;
  reduce: any;
  grouped: string;
  score: any;
}

interface RequiredDoc {
  id: number;
  product_type_id: number;
  name: string;
  description: string;
  url?: string;
  created_at: string;
}

interface SubmissionDetailProps {
  submission: {
    id?: number;
    documents: string;
    status: string;
    contract_value: number;
    guarantee_value: number;
    job_location_village: string;
    start_date: string;
    end_date: string;
    principal: {
      address: string;
      commissioner: string;
      created_at: string;
      created_by: number;
      deleted_at: string | null;
      director_name: string;
      director_phone: string;
      director_position: string;
      district_id: number;
      fax: string;
      head_name: string;
      headquarter_id: number | null;
      id: number;
      is_approved: number;
      last_deed: string;
      name: string;
      nib: string;
      npwp: string;
      pic: string;
      picture: string | null;
      province_id: number;
      regency_id: number;
      siup_siujk: string;
      telephone: string;
      updated_at: string;
      village: string;
      year_established: string;
      documents: Document[];
      ratios: Ratio[];
    };
    guarantor_to_product_type: {
      name: string;
      full_name: string;
      job_group: string;
    };
    obligee: {
      name: string;
      address: string;
    };
    source_of_fund: {
      name: string;
    };
    scores: Score[];
    required_docs: RequiredDoc[];
    contract_doc_name: string;
    contract_doc_number: string;
    contract_doc_date: string; // Format: YYYY-MM-DD
    time_period: number;
    job_name: string;
    guarantee_issue_date: string; // Format: YYYY-MM-DD
    job_location: string;

    // limit
    employee_limit: number;
    product_limit: number;
    beyond_the_limit: boolean;
  };
  bank: {
    id: number;
    name: string;
    address: string;
    telephone: string;
    fax: string;
    pic: string;
    created_at: string;
    updated_at: string;
    village: string;
    district_id: number;
    province_id: number;
    regency_id: number;
  };
  contract_doc_date: string;
  contract_doc_name: string;
  contract_doc_number: string;
  contract_value: number;
  created_at: string | null;
  deleted_at: string | null;
  end_date: string;
  guarantee_issue_date: string | null;
  guarantee_value: number;
  guarantor: {
    id: number;
    name: string;
    address: string;
    telephone: string;
    fax: string;
    email: string;
    code: string;
    pic: string;
    created_at: string;
    updated_at: string;
    district_id: number;
    province_id: number;
    regency_id: number;
    village: string;
  };
  guarantor_id: number;
  guarantor_to_product_type: {
    id: number;
    guarantor_id: number;
    product_id: number;
    product_type_id: number;
    name: string;
    full_name: string;
    job_group: string;
    code: string;
    created_at: string;
    updated_at: string;
  };
  guarantor_to_product_type_id: number;
  id: number;
  job_location_district_id: number;
  job_location_province_id: number;
  job_location_regency_id: number;
  job_location_village: string;
  min_point_scoring: string;
  note: string | null;
  note_scoring: string | null;
  obligee: {
    id: number;
    name: string;
    address: string;
    telephone: string;
    fax: string;
    pic: string;
    village: string;
    district_id: number;
    province_id: number;
    regency_id: number;
    created_at: string;
    updated_at: string;
  };
  obligee_id: number;
  principal: {
    address: string;
    commissioner: string;
    created_at: string;
    created_by: number;
    deleted_at: string | null;
    director_name: string;
    director_phone: string;
    director_position: string;
    district_id: number;
    fax: string;
    head_name: string;
    headquarter_id: number | null;
    id: number;
    is_approved: number;
    last_deed: string;
    name: string;
    nib: string;
    npwp: string;
    pic: string;
    picture: string | null;
    province_id: number;
    regency_id: number;
    siup_siujk: string;
    telephone: string;
    updated_at: string;
    village: string;
    year_established: string;
  };
  principal_id: number;
  product_id: number;
  source_of_fund: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
  };
  source_of_fund_id: number;
  start_date: string;
  time_period: number;
  scores: {
    score: string;
  };
  updated_at: string;
}

export type SubmissionDetailPageProps = React.FC<SubmissionDetailProps> & {
  layout?: (page: any) => JSX.Element;
};
