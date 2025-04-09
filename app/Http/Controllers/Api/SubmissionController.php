<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Submission\CallbackRequest;
use App\Models\Submission\Submission;
use App\Models\Submission\SubmissionCallback;
use App\Services\HostToHostService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\JsonResponse;

class SubmissionController extends Controller
{
    protected HostToHostService $hostToHostService;

    public function __construct(HostToHostService $hostToHostService)
    {
        $this->hostToHostService = $hostToHostService;
    }

    public function callback(CallbackRequest $request): JsonResponse
    {
        try {
            // image is base64
            $imageString = $request->get('image');
            // base64 to file
            $fileData = $this->base64ToFile($imageString);
            $submissionId = $request->get('submission_id');
            // save image to storage
            $url = $this->uploadFile($fileData, 'submission/callback', $submissionId.'-image-from-guarantor');

            $data = SubmissionCallback::query()->updateOrCreate(
                ['submission_id' => $submissionId],
                [
                    'submission_id' => $submissionId,
                    'doc_url' => $request->get('doc_url'),
                    'url' => $url,
                    'no_policy' => $request->get('policyno'),
                ]
            );

            Log::info('Callback Success: ', $data->toArray());

            return $this->responseSuccess('Berhasil Mengirimkan data');
        } catch (Exception $e) {
            $error = $this->handleErrorMessage($e);
            Log::error('Callback Error: ', $error);

            return $this->responseError('Terjadi Kesalahan Saat Mengirimkan data', $error);
        }
    }

    public function postToGetCallback(Request $request): JsonResponse
    {
        $submissionId = $request->get('submission_id');
        $submission = Submission::query()
            ->with(['guarantor', 'guarantor.hostToHost'])
            ->find($submissionId);
        $guarantor = $submission->getRelation('guarantor');
        $hostToHost = $guarantor->getRelation('hostToHost');
        $url = $hostToHost->getAttribute('guarantor_url_host').'/submission/status';
        $prefix = $hostToHost->getAttribute('auth_prefix');
        $token = ($prefix ? $prefix.' ' : '').$hostToHost->getAttribute('token');

        $result = $this->hostToHostService->sendPostRequest($url, $token, ['submission_id' => $submissionId]);

        if ($result['status'] === 'success') {
            $data = $result['message'];
            // image is base64
            $imageString = $data['image'] ?? null;
            if ($imageString) {
                // base64 to file
                $fileData = $this->base64ToFile($imageString);
                // save image to storage
                $url = $this->uploadFile($fileData, 'submission/callback', $submissionId.'-image-from-guarantor');
                $submission->update(['has_send_to_guarantor' => true]);
                SubmissionCallback::query()->updateOrCreate(
                    ['submission_id' => $submissionId],
                    [
                        'submission_id' => $submissionId,
                        'doc_url' => $data['doc_url'],
                        'url' => $url,
                        'no_policy' => $data['policyno'],
                    ]
                );
            }

            Log::info('Callback Success: ', $data);

            return $this->responseSuccess('Berhasil Mengambil Data', $data);
        } else {
            Log::error('Error Callback: ', ['message' => $result['message']]);

            return $this->responseError('Terjadi Kesalahan Saat Mengambil Data', $result['message']);
        }
    }

    public function checkForSendData($submissionId): JsonResponse
    {
        $submission = Submission::query()
            ->with([
                'principal:id,name,telephone,pic,npwp,nib,siup_siujk,head_name,business_fields,'.
                'director_name,director_position,director_phone,commissioner,year_established,'.
                'last_deed,province_id,regency_id,district_id,village,address,postal_code',
                'principal.province:id,code,name',
                'principal.regency:id,code,name',
                'principal.district:id,code,name',
                'principal.documents:id,principal_id,name,url',
                'blanks',
                'guarantor:id,code,name',
                'guarantorBranch:id,code,name',
                'guarantor.hostToHost:id,guarantor_id,guarantor_url_host,auth_prefix,token',
                'product:id,name',
                'guarantorToProductType:id,product_type_id,name,job_group,job_type',
                'obligee:id,name,telephone,pic,no_ppk,province_id,regency_id,district_id,village,address,postal_code',
                'obligee.province:id,code,name',
                'obligee.regency:id,code,name',
                'obligee.district:id,code,name',
                'province:id,code,name',
                'regency:id,code,name',
                'district:id,code,name',
                'sourceOfFund:id,name',
                'submissionDocs:id,submission_id,name,format_document,url',
            ])->find($submissionId);
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
        $submissionDocs = $submission->getRelation('submissionDocs')->whereNotNull('format_document');
        $submissionDocsFile = $submission->getRelation('submissionDocs')->whereNull('format_document');

        $hostToHost = $guarantor->getRelation('hostToHost');
        $url = $hostToHost->getAttribute('guarantor_url_host');
        $prefix = $hostToHost->getAttribute('auth_prefix');
        $token = ($prefix ? $prefix.' ' : '').$hostToHost->getAttribute('token');
        $result = [
            'submission_id' => $submission->getAttribute('id'),
            'principal' => [
                'id' => $principal->getAttribute('id'),
                'name' => $principal->getAttribute('name'),
                'telephone' => $principal->getAttribute('telephone'),
                'pic' => $principal->getAttribute('pic'),
                'npwp' => $principal->getAttribute('npwp'),
                'nib' => $principal->getAttribute('nib'),
                'siup_siujk' => $principal->getAttribute('siup_siujk'),
                'head_name' => $principal->getAttribute('head_name'),
                'business_fields' => $principal->getAttribute('business_fields'),
                'director' => [
                    'name' => $principal->getAttribute('director_name'),
                    'position' => $principal->getAttribute('director_position'),
                    'phone' => $principal->getAttribute('director_phone'),
                    'commissioner' => $principal->getAttribute('commissioner'),
                ],
                'year_established' => $principal->getAttribute('year_established'),
                'last_legality' => $principal->getAttribute('last_deed'),
                'location' => [
                    'province' => $principal->province?->only(['code', 'name']),
                    'regency' => $principal->regency?->only(['code', 'name']),
                    'district' => $principal->district?->only(['code', 'name']),
                    'village' => $principal->getAttribute('village'),
                    'address' => $principal->getAttribute('address'),
                    'postal_code' => $principal->getAttribute('postal_code'),
                ],
                'docs' => $principal->getRelation('documents')->map(function ($doc) {
                    return [
                        'name' => $doc->getAttribute('name'),
                        'url' => $doc->getAttribute('url'),
                    ];
                })->toArray(),
            ],
            'guarantee' => [
                'no' => $submission->getAttribute('no_guarantee'),
                'value' => $submission->getAttribute('guarantee_value'),
        ],
            'contract' => [
                'blank' => $blank?->number,
                'value' => $submission->getAttribute('contract_value'),
                'document' => [
                    'name' => $submission->getAttribute('contract_doc_name'),
                    'number' => $submission->getAttribute('contract_doc_number'),
                    'date' => $submission->getAttribute('contract_doc_date'),
                ],
                'guarantor' => [
                    ...$guarantor->only(['id', 'code', 'name']),
                    'branch' => $guarantorBranch?->only(['id', 'code', 'name']),
                ],
                'product' => $product->only(['id', 'name']),
                'product_type' => [
                    'id' => $guarantorToProductType->getAttribute('product_type_id'),
                    'name' => $guarantorToProductType->getAttribute('name'),
                ],
                'obligee' => [
                    'name' => $obligee->getAttribute('name'),
                    'telephone' => $obligee->getAttribute('telephone'),
                    'pic' => $obligee->getAttribute('pic'),
                    'no_ppk' => $obligee->getAttribute('npwp'),
                    'location' => [
                        'province' => $obligee->province?->only(['code', 'name']),
                        'regency' => $obligee->regency?->only(['code', 'name']),
                        'district' => $obligee->district?->only(['code', 'name']),
                        'village' => $obligee->getAttribute('village'),
                        'address' => $obligee->getAttribute('address'),
                        'postal_code' => $obligee->getAttribute('postal_code'),
                    ],
                ],
                'project' => [
                    'name' => $submission->getAttribute('job_name'),
                    'group' => $guarantorToProductType->getAttribute('job_group'),
                    'type' => $guarantorToProductType->getAttribute('job_type'),
                    'time_period' => $submission->getAttribute('time_period'),
                    'start_date' => $submission->getAttribute('start_date'),
                    'end_date' => $submission->getAttribute('end_date'),
                    'source_of_fund' => $sourceOfFound->only(['id', 'name']),
                    'location' => [
                        'province' => $jobProvince->only(['code', 'name']),
                        'regency' => $jobRegency->only(['code', 'name']),
                        'district' => $jobDistrict->only(['code', 'name']),
                        'village' => $submission->getAttribute('job_location_village'),
                        'address' => $submission->getAttribute('job_location_address'),
                        'postal_code' => $submission->getAttribute('job_location_postal_code'),
                    ],
                ],
        ],
            'output' => $submissionDocs->map(function ($doc) {
                return [
                    'name' => $doc->getAttribute('name'),
                    'value' => $doc->getAttribute('format_document'),
                ];
            })->toArray(),
            'final_output_file' => $submissionDocsFile->map(function ($doc) {
                return [
                    'name' => $doc->getAttribute('name'),
                    'url' => $doc->getAttribute('url'),
                ];
            })->toArray(),
        ];

        return $this->responseSuccess('Berhasil Mengambil Data', $result);
    }
}
