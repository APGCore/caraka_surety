import { Card, CardContent, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import React from "react";

const SubmissionPlaceholderUI = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Principal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Principal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> [principal_name]
          </p>
          <p>
            <strong>Address:</strong> [principal_address]
          </p>
          <p>
            <strong>NPWP:</strong> [npwp]
          </p>
          <p>
            <strong>NIB:</strong> [nib]
          </p>
          <p>
            <strong>Telephone:</strong> [telephone]
          </p>
          <p>
            <strong>Director Name:</strong> [director_name]
          </p>
          <p>
            <strong>Director Phone:</strong> [director_phone]
          </p>
          <p>
            <strong>Business Field:</strong> [bussiness_field]
          </p>
          <p>
            <strong>PIC:</strong> [pic]
          </p>
          <p>
            <strong>Director Position:</strong> [director_position]
          </p>
          <p>
            <strong>Location:</strong> [location]
          </p>
        </CardContent>
      </Card>

      {/* Obligee Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Obligee Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> [obligee_name]
          </p>
          <p>
            <strong>Address:</strong> [obligee_address]
          </p>
          <p>
            <strong>Source of Fund:</strong> [source_of_fund]
          </p>
          <p>
            <strong>PPK Name:</strong> [ppk_name]
          </p>
          <p>
            <strong>City:</strong> [obligee_city]
          </p>
          <p>
            <strong>Location:</strong> [obligee_location]
          </p>
        </CardContent>
      </Card>

      {/* Guarantor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Guarantor Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> [guarantor_name]
          </p>
          <p>
            <strong>Address:</strong> [guarantor_address]
          </p>
          <p>
            <strong>PIC:</strong> [guarantor_pic]
          </p>
          <p>
            <strong>Location:</strong> [guarantor_location]
          </p>
        </CardContent>
      </Card>

      {/* Contract Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contract Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Mail Number:</strong> [mail_number]
          </p>
          <p>
            <strong>Guarantee Number:</strong> [guarantee_number]
          </p>
          <p>
            <strong>Guarantee Value:</strong> [guarantee_value]
          </p>
          <p>
            <strong>Contract Value:</strong> [contract_value]
          </p>
          <p>
            <strong>Guarantee Type:</strong> [guarantee_type]
          </p>
          <p>
            <strong>Time Period:</strong> [time_period]
          </p>
          <p>
            <strong>Job Name:</strong> [job_name]
          </p>
          <p>
            <strong>Job Location:</strong> [job_location]
          </p>
          <p>
            <strong>Contract Document Name:</strong> [contract_doc_name]
          </p>
          <p>
            <strong>Contract Document Number:</strong> [contract_doc_number]
          </p>
          <p>
            <strong>Contract Document Date:</strong> [contract_doc_date]
          </p>
          <p>
            <strong>Start Date:</strong> [start_date]
          </p>
          <p>
            <strong>End Date:</strong> [end_date]
          </p>
          <p>
            <strong>Guarantee Issue Date:</strong> [guarantee_issue_date]
          </p>
          <p>
            <strong>Submission Date:</strong> [submission_date]
          </p>
        </CardContent>
      </Card>

      {/* Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Character:</strong> [analysis.character]
          </p>
          <p>
            <strong>Capacity:</strong> [analysis.capacity]
          </p>
          <p>
            <strong>Capital:</strong> [analysis.capital]
          </p>
          <p>
            <strong>Condition:</strong> [analysis.condition]
          </p>
          <p>
            <strong>Collateral:</strong> [analysis.collateral]
          </p>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Additional Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Scoring Result:</strong> [scoring_result]
          </p>
          <p>
            <strong>Date:</strong> [date]
          </p>
          <p>
            <strong>Manager Name:</strong> [manager_name]
          </p>
          <p>
            <strong>Branch Manager:</strong> [branch_manager]
          </p>
          <p>
            <strong>Job Group:</strong> [job_group]
          </p>
          <p>
            <strong>City:</strong> [city]
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubmissionPlaceholderUI;
