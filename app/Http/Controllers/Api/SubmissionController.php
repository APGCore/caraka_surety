<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Submission\CallbackRequest;
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
            'guarantor:id,name',
            'guarantorBranch:id,name',
            'product:id,name',
            'guarantorToProductType:id,name,job_group,job_type',
            'obligee:id,name,telephone,pic,no_ppk,province_id,regency_id,district_id,village,address,postal_code',
            'obligee.province:id,code,name',
            'obligee.regency:id,code,name',
            'obligee.district:id,code,name',
            'province:id,code,name',
            'regency:id,code,name',
            'district:id,code,name',
            'sourceOfFund:id,name',
        ]);
        $principal = $submission->getRelation('principal');
        $blank = $submission->getRelation('blanks')->where('is_broken', false)->first();
        $guarantor = $submission->getRelation('guarantor');
        $guarantorBranch = $submission->getRelation('guarantorBranch');
        $product = $submission->getRelation('product');
        $guarantorToProductType = $submission->getRelation('guarantorToProductType');
        $obligee = $submission->getRelation('obligee');
        $jobProvince = $submission->getRelation('province');
        $jobRegency = $submission->getRelation('regency');
        $jobDistrict = $submission->getRelation('district');
        $sourceOfFound = $submission->getRelation('sourceOfFund');
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
                    'code' => $principal->province?->getAttribute('code'),
                    'name' => $principal->province?->getAttribute('name'),
                ],
                'regency' => (object) [
                    'code' => $principal->regency?->getAttribute('code'),
                    'name' => $principal->regency?->getAttribute('name'),
                ],
                'district' => (object) [
                    'code' => $principal->district?->getAttribute('code'),
                    'name' => $principal->district?->getAttribute('name'),
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
                'guarantor_name' => $guarantor->getAttribute('name'),
                'guarantor_branch_name' => $guarantorBranch?->getAttribute('name'),
                'product_name' => $product->getAttribute('name'),
                'product_type_name' => $guarantorToProductType->getAttribute('name'),
                'obligee' => (object) [
                    'id' => $obligee->getAttribute('id'),
                    'name' => $obligee->getAttribute('name'),
                    'telephone' => $obligee->getAttribute('telephone'),
                    'pic' => $obligee->getAttribute('pic'),
                    'no_ppk' => $obligee->getAttribute('npwp'),
                    'province' => (object) [
                        'code' => $obligee->province?->getAttribute('code'),
                        'name' => $obligee->province?->getAttribute('name'),
                    ],
                    'regency' => (object) [
                        'code' => $obligee->regency?->getAttribute('code'),
                        'name' => $obligee->regency?->getAttribute('name'),
                    ],
                    'district' => (object) [
                        'code' => $obligee->district?->getAttribute('code'),
                        'name' => $obligee->district?->getAttribute('name'),
                    ],
                    'village' => $obligee->getAttribute('village'),
                    'address' => $obligee->getAttribute('address'),
                    'postal_code' => $obligee->getAttribute('postal_code'),
                ],
                'project' => (object) [
                    'name' => $submission->getAttribute('job_name'),
                    'group' => $guarantorToProductType->getAttribute('job_group'),
                    'type' => $guarantorToProductType->getAttribute('job_type'),
                    'time_period' => $submission->getAttribute('time_period'),
                    'start_date' => $submission->getAttribute('start_date'),
                    'end_date' => $submission->getAttribute('end_date'),
                    'source_of_fund' => $sourceOfFound->getAttribute('name'),
                    'location' => (object) [
                        'province' => (object) [
                            'code' => $jobProvince->getAttribute('code'),
                            'name' => $jobProvince->getAttribute('name'),
                        ],
                        'regency' => (object) [
                            'code' => $jobRegency->getAttribute('code'),
                            'name' => $jobRegency->getAttribute('name'),
                        ],
                        'district' => (object) [
                            'code' => $jobDistrict->getAttribute('code'),
                            'name' => $jobDistrict->getAttribute('name'),
                        ],
                        'village' => $submission->getAttribute('job_location_village'),
                        'address' => $submission->getAttribute('job_location_address'),
                        'postal_code' => $submission->getAttribute('job_location_postal_code'),
                    ],
                ],
            ],
        ];

        return $this->responseSuccess('success', $result);
    }

    public function callback(CallbackRequest $request): JsonResponse
    {
        try {
            $submission = Submission::query()->find($request->get('submission_id'));
            $submission->setAttribute('verified_doc_link', $request->get('doc_url'));
            $submission->save();

            return $this->responseSuccess('success', [
                'submission_id' => $submission->getAttribute('id'),
                'doc_url' => $submission->getAttribute('verified_doc_link'),
            ]);
        } catch (\Exception $e) {
            return $this->responseError('Terjadi Kesalahan Saat Mengirimkan data', $e->getMessage());
        }
    }
}
