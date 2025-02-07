<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Submission\Submission;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class SubmissionController extends Controller
{
    public function show(Request $request, Submission $submission): JsonResponse
    {
        $submission->load([
            'principal:id,name,telephone,pic,npwp,nib,siup_siujk,head_name,business_fields,'.
            'director_name,director_position,director_phone,commissioner,year_established,'.
            'last_deed,province_id,regency_id,district_id,village,address,postal_code',
            'principal.province:id,code,name',
            'principal.regency:id,code,name',
            'principal.district:id,code,name',
            'blanks',
        ]);
        $principal = $submission->getRelation('principal');
        $blank = $submission->getRelation('blanks')->where('is_broken', false)->first();
        $result = (object) [
            'submission_id' => $submission->getAttribute('id'),
            'principal' => (object) [
                'id' => $principal->getAttribute('id'),
                'name' => $principal->getAttribute('name'),
                'telephone' => $principal->getAttribute('telephone'),
                'pic' => $principal->getAttribute('pic'),
                'npwp' => $principal->getAttribute('npwp'),
                'nib' => $principal->getAttribute('nib'),
                'siup_siujk' => $principal->getAttribute('siup_siujk'),
                'head_name' => $principal->getAttribute('head_name'),
                'business_fields' => $principal->getAttribute('business_fields'),
                'director_name' => $principal->getAttribute('director_name'),
                'director_position' => $principal->getAttribute('director_position'),
                'director_phone' => $principal->getAttribute('director_phone'),
                'commissioner' => $principal->getAttribute('commissioner'),
                'year_established' => $principal->getAttribute('year_established'),
                'last_legality' => $principal->getAttribute('last_deed'),
                'province' => (object) [
                    'code' => $principal->province->getAttribute('code'),
                    'name' => $principal->province->getAttribute('name'),
                ],
                'regency' => (object) [
                    'code' => $principal->regency->getAttribute('code'),
                    'name' => $principal->regency->getAttribute('name'),
                ],
                'district' => (object) [
                    'code' => $principal->district->getAttribute('code'),
                    'name' => $principal->district->getAttribute('name'),
                ],
                'village' => $principal->getAttribute('village'),
                'address' => $principal->getAttribute('address'),
                'postal_code' => $principal->getAttribute('postal_code'),
            ],
            'guarantee' => (object) [
                'no' => $submission->getAttribute('no_guarantee'),
                'value' => $submission->getAttribute('guarantee_value'),
            ],
            'contract' => (object) [
                'value' => $submission->getAttribute('contract_value'),
                'doc_name' => $submission->getAttribute('doc_name'),
                'doc_number' => $submission->getAttribute('doc_number'),
                'doc_date' => $submission->getAttribute('doc_date'),
                'blank' => $blank?->number,
                'start_date' => $submission->getAttribute('start_date'),
                'end_date' => $submission->getAttribute('end_date'),
                'time_period' => $submission->getAttribute('time_period'),
            ],
            //            'submission' => $submission,
        ];

        return $this->responseSuccess('success', $result);
    }
}
