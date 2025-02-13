import { Ratio } from "@/pages/staff/submission-management/create/submission-create-page.type";
import React from "react";

interface Document {
  name: string;
  url: string;
  id: number;
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

interface Principal {
  address: string;
  commissioner: string;
  created_at: string;
  created_by: number;
  deleted_at: string | null;
  director_name: string;
  director_phone: string;
  director_position: string;
  district_id: number;
  bussiness_field: string;
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
  district: {
    name: string;
  };

  regency: {
    name: string;
  };
  province: {
    name: string;
  };
}

interface GuarantorToProductType {
  name: string;
  full_name: string;
  job_group: string;
}
interface Obligee {
  name: string;
  address: string;
  pic: string;
  district: {
    name: string;
  };

  regency: {
    name: string;
  };
  province: {
    name: string;
  };
}

interface Guarantor {
  name: string;
  pic: string;
  address: string;
  district: {
    name: string;
  };

  regency: {
    name: string;
  };
  province: {
    name: string;
  };
}

interface SourceOfFund {
  name: string;
}

interface Bank {
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
}

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role_id: number;
  username: string;
  profile_picture: string | null;
  village: string;
  district_id: number;
  province_id: number;
  regency_id: number;
}

interface SubmissionDetailProps {
  submission: {
    id: number;
    bank: Bank;
    approved_by_direksi: boolean;
    documents: string;
    status: string;
    contract_value: number;
    guarantee_value: number;
    job_location_village: string;
    start_date: string;
    end_date: string;
    created_at: string;
    principal: Principal;
    guarantor_to_product_type: GuarantorToProductType;
    guarantor: Guarantor;
    obligee: Obligee;
    source_of_fund: SourceOfFund;
    scores: Score[];
    required_docs: RequiredDoc[];
    contract_doc_name: string;
    contract_doc_number: string;
    contract_doc_date: string; // Format: YYYY-MM-DD
    time_period: number;
    job_name: string;
    guarantee_issue_date: string; // Format: YYYY-MM-DD
    job_location: string;
    user_checked: User;
    checked_at: string;
    user_approved: User;
    approved_at: string;
    user_rejected: User;
    rejected_at: string;
    beyond_the_limit: boolean;
    document_format_analysis: {
      format_document: any;
      name: string;
      map: any;
      length: any;
      filter: any;
    };
    document_format_guarantor: {
      format_document: string;
      name: string;
      map: any;
      length: any;
      filter: any;
    };
    document_format_product: {
      format_document: string;
      name: string;
      map: any;
      length: any;
      filter: any;
    };
    document_format_type_guarantee: {
      format_document: string;
      name: string;
      map: any;
      length: any;
      filter: any;
    };
    document_formats: {
      format_document: string;
      name: string;
      map: any;
      length: any;
    };
    district: {
      name: string;
    };
    regency: {
      name: string;
    };
    province: {
      name: string;
    };
    submission_docs: Document[];
    contract_value_formatted: string;
    guarantee_value_formatted: string;
    mail_number: string;
    no_guarantee: string;
    bank_name: string;
    analyst_name: string;
    product: {
      name: string;
    };
  };

  submissionData: {
    principal_name: string;
    principal_address: string;
    npwp: string;
    nib: string;
    telephone: string;
    director_name: string;
    director_phone: string;
    pic: string;
    director_position: string;
    location: string;

    bank: string;
    obligee_name: string;
    obligee_address: string;
    source_of_fund: string;
    ppk_name: string;
    obligee_city: string;
    obligee_location: string;

    guarantor_name: string;
    guarantor_address: string;
    guarantor_pic: string;
    guarantor_location: string;

    source_of_fund_name: string;
    contract_value: number;
    guarantee_value: number;
    guarantee_type: string;
    time_period: string | number;
    job_name: string;
    job_location_village: string;
    contract_doc_name: string;
    contract_doc_number: string;
    contract_doc_date: string;
    start_date: string;
    end_date: string;
    guarantee_issue_date: string;
    submission_date: string;
    analysis: {
      character: string | number;
      capacity: string | number;
      capital: string | number;
      condition: string | number;
      collateral: string | number;
    };
    scoring_result: {
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
    };
    date: string;
    manager_name: string;
    branch_manager: string;
    job_location: string;
    job_group: string;
    no: string | number;
    city: string;
  };
}

interface SubmissionData {
  principal_name: string;
  principal_address: string;
  npwp: string;
  nib: string;
  telephone: string;
  director_name: string;
  director_phone: string;
  pic: string;
  director_position: string;
  location: string;

  obligee_name: string;
  obligee_address: string;
  source_of_fund: string;
  ppk_name: string;
  obligee_city: string;
  obligee_location: string;

  guarantor_name: string;
  guarantor_address: string;
  guarantor_pic: string;
  guarantor_location: string;

  source_of_fund_name: string;
  contract_value: number;
  guarantee_value: number;
  guarantee_type: string;
  time_period: string | number;
  job_name: string;
  job_location_village: string;
  contract_doc_name: string;
  contract_doc_number: string;
  contract_doc_date: string;
  start_date: string;
  end_date: string;
  guarantee_issue_date: string;
  submission_date: string;
  analysis: {
    character: string | number;
    capacity: string | number;
    capital: string | number;
    condition: string | number;
    collateral: string | number;
  };
  scoring_result: {
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
  };
  date: string;
  manager_name: string;
  branch_manager: string;
  job_location: string;
  job_group: string;
  no: string | number;
  city: string;

  bank_name: string;
  contract_value_formatted: string;
  guarantee_value_formatted: string;
  [key: string]: any;
}

export type SubmissionDetailPageProps = React.FC<SubmissionDetailProps> & {
  layout?: (page: any) => JSX.Element;
};
