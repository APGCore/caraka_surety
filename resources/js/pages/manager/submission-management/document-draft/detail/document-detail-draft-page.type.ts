import React from "react";

interface SubmissionDocumentDraftProps {
  submission: {
    [key: string]: any;
    map: any;
    id: number;
    length: any;
    submission: string;
    bank_name: string;
    approved_by_direksi: boolean;
    documents: string;
    status: string;
    contract_value: number;
    guarantee_value: number;
    job_location_village: string;
    start_date: string;
    end_date: string;
    created_at: string;
    contract_doc_name: string;
    contract_doc_number: string;
    contract_doc_date: string; // Format: YYYY-MM-DD
    time_period: number;
    job_name: string;
    guarantee_issue_date: string; // Format: YYYY-MM-DD
    job_location: string;
    checked_at: string;
    approved_at: string;
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
    no_guarantee: string;
    contract_value_formatted: string;
    guarantee_value_formatted: string;

    mail_number: string;
    mail_number_resume: string;
    product: {
      name: string;
    };

    analysis: {
      character: number;
      capacity: number;
      capital: number;
      condition: number;
      collateral: number;
    };
    job_type: string;
    analyst_name: string;
    get_exp: string;
    notes: string;
    recommendation: string;
    total_score: number;
    get_administators_principal: string;
    day_name: string;
    submission_date: string;
  };
}

export type SubmissionDocumentDraftPageProps = React.FC<SubmissionDocumentDraftProps> & {
  layout?: (page: any) => JSX.Element;
};
