<?php

namespace App\Http\Controllers\Api;

use App\Enums\OfficeType;
use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Submission\CallbackRequest;
use App\Http\Requests\Api\Submission\SaveDocSignatureRequest;
use App\Http\Requests\Api\Submission\SetBlankRequest;
use App\Http\Requests\Api\Submission\StoreDocumentRequest;
use App\Http\Requests\Api\Submission\UpdateDocumentRequest;
use App\Models\Guarantor\Blank;
use App\Models\Profile\Profile;
use App\Models\Submission\Submission;
use App\Models\Submission\SubmissionCallback;
use App\Models\Submission\SubmissionDoc;
use App\Services\HostToHostService;
use App\Traits\GeneratePattern;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\JsonResponse;

class SubmissionController extends Controller
{
    use GeneratePattern;

    protected HostToHostService $hostToHostService;

    public function __construct(HostToHostService $hostToHostService)
    {
        $this->hostToHostService = $hostToHostService;
    }

    public function setBlank(SetBlankRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $submissionId = $request->get('submission_id');
            $blankId = $request->get('blank_id');

            $submission = Submission::query()->with([
                'submissionBefore:id,no_guarantee',
                'guarantor:id,code,name',
                'guarantorBranch:id,code,name',
                'guarantorToProductType:id,code_product',
            ])->find($submissionId);
            if (! $submission) {
                return $this->responseError('Pengajuan tidak ditemukan');
            }
            $guarantor = $submission->getRelation('guarantor');
            $guarantorBranch = $submission->getRelation('guarantorBranch');
            $guarantorToProductType = $submission->getRelation('guarantorToProductType');
            $profile = Profile::query()->firstWhere('office_type', OfficeType::HEADQUARTER->value);
            $blank = Blank::query()->find($blankId);

            $submissionBefore = $submission->getRelation('submissionBefore');
            if ($submissionBefore) {
                $noGuarantee = $submissionBefore->getAttribute('no_guarantee');
            } else {
                $noGuarantee = $this->generateNoGuarantee(
                    $guarantor,
                    $guarantorToProductType,
                    $guarantorBranch,
                    $blank,
                    $profile
                );
            }

            $submission->blank()->update(['is_picked' => false]);
            $submission->update([
                'blank_id' => $blankId,
                'no_guarantee' => $noGuarantee,
            ]);
            $blank->update(['is_picked' => true]);
            DB::commit();
            $data = [
                'submission_id' => $submissionId,
                'blank_id' => $blankId,
                'no_guarantee' => $noGuarantee,
            ];
            Log::info('Blangko pengajuan berhasil diatur', $data);

            return $this->responseSuccess('Berhasil mengatur blangko pengajuan');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to set blank', $error);

            return $this->responseError('Gagal mengatur blangko pengajuan', $error);
        }
    }

    /**
     * @throws Exception
     */
    public function postToGetCallback(CallbackRequest $request): JsonResponse
    {
        $submissionId = $request->get('submission_id');
        $submissionFirst = Submission::query()
            ->select(['id', 'no_guarantee', 'created_at'])
            ->firstWhere('id', $submissionId);

        $submission = Submission::query()
            ->where(function ($query) {
                $query->where('status', SubmissionStatus::APPROVED->value)
                    ->orWhere('status', SubmissionStatus::REVISED->value);
            })
            ->where('has_send_to_guarantor', true)
            ->orderBy('created_at')
            ->with(['guarantor', 'guarantor.hostToHost'])
            ->firstWhere('no_guarantee', $submissionFirst->getAttribute('no_guarantee'));
        if (! $submission) {
            Log::error('Submission not found for callback', ['submission_id' => $submissionId, 'no_guarantee' => $submissionFirst->getAttribute('no_guarantee')]);

            return $this->responseError('Pengajuan tidak ditemukan atau belum mendapatkan persetujuan dari asuransi');
        }

        $submissionFirstId = $submission->getAttribute('id');
        $guarantor = $submission->getRelation('guarantor');
        $hostToHost = $guarantor->getRelation('hostToHost');
        $url = $hostToHost->getAttribute('guarantor_url_host').'/submission/status';
        $prefix = $hostToHost->getAttribute('auth_prefix');
        $token = ($prefix ? $prefix.' ' : '').$hostToHost->getAttribute('token');

        Log::info('Mengambil data callback untuk submission:', ['no jaminan' => $submission->getAttribute('no_guarantee')]);
        $result = $this->hostToHostService->sendPostRequest($url, $token, ['submission_id' => $submissionFirstId]);

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

            if (isset($data['error'])) {
                Log::error('Error Callback: ', $data['error']);

                return $this->responseError($data['error']['message'] ?? 'Data Belum Diterima Dari Asuransi', $data['error']);
            }

            Log::info('Callback Success: ', $data);

            return $this->responseSuccess('Berhasil Mengambil Data Callback', $data);
        } else {
            Log::error('Error Callback: ', $result);

            return $this->responseError('Terjadi Kesalahan Saat Mengambil Data Callback');
        }
    }

    public function saveDocSignature(SaveDocSignatureRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $submissionId = $request->input('submission_id');
            $documents = [];

            if ($request->hasFile('spkmgr_file')) {
                $spkmgrFile = $request->file('spkmgr_file');
                // Generate nama file unik
                $uniqueName = uniqid('spkmgr_', true).'.'.$spkmgrFile->getClientOriginalExtension();
                $spkmgrPath = $this->uploadFile($spkmgrFile, "documents/spkmgr/$submissionId", $uniqueName);
                $documents[] = [
                    'submission_id' => $submissionId,
                    'document_format_id' => null,
                    'name' => 'Surat Pernyataan Kesediaan Membayar Ganti Rugi (SPKMGR)',
                    'format_document' => null,
                    'url' => $spkmgrPath,
                ];
            }

            if ($request->hasFile('permohonan_file')) {
                $permohonanFile = $request->file('permohonan_file');
                // Generate nama file unik
                $uniqueName = uniqid('permohonan_', true).'.'.$permohonanFile->getClientOriginalExtension();
                $permohonanPath = $this->uploadFile($permohonanFile, "documents/permohonan/$submissionId", $uniqueName);
                $documents[] = [
                    'submission_id' => $submissionId,
                    'document_format_id' => null,
                    'name' => 'Surat Permohonan',
                    'format_document' => null,
                    'url' => $permohonanPath,
                ];
            }

            foreach ($documents as $document) {
                SubmissionDoc::query()->updateOrCreate(
                    ['submission_id' => $document['submission_id'], 'url' => $document['url']], // Key untuk mencocokkan dokumen
                    $document
                );
            }

            DB::commit();

            return response()->json([
                'message' => 'File berhasil diunggah dan disimpan.',
                'data' => $documents,
            ]);
        } catch (Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Gagal mengunggah file.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function storeDocument(StoreDocumentRequest $request, $submissionId): JsonResponse
    {
        DB::beginTransaction();
        try {
            $submission = Submission::query()->findOrFail($submissionId);
            $documents = $request->get('documents', []);
            if (count($documents) > 0) {
                $submission->submissionDocs()->whereNotNull('document_format_id')->delete();
                $docData = collect($documents)->map(fn ($doc) => [
                    'document_format_id' => $doc['id'] ?? null,
                    'name' => $doc['name'] ?? null,
                    'format_document' => $doc['content'],
                    'url' => $doc['url'] ?? null,
                ])->toArray();
                $submission->submissionDocs()->createMany($docData);
            }
            DB::commit();

            return $this->responseSuccess('Berhasil menyimpan dokumen pengajuan');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to save documents', $error);

            return $this->responseError('Gagal menyimpan dokumen pengajuan', $error);
        }
    }

    public function updateDocument(UpdateDocumentRequest $request, SubmissionDoc $submissionDoc): JsonResponse
    {
        $validated = $request->validated();

        DB::beginTransaction();
        try {
            $submissionDoc->update([
                'format_document' => $validated['format'],
            ]);

            DB::commit();

            return $this->responseSuccess('Berhasil mengubah format dokumen');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to update document format', $error);

            return $this->responseError('Gagal mengubah format dokumen', $error);
        }
    }

    public function send($submissionId): JsonResponse
    {
        try {
            $submission = Submission::query()
                ->with([
                    'principal:id,name,telephone,pic,npwp,nib,siup_siujk,head_name,business_fields,'.
                    'director_name,director_position,director_phone,commissioner,year_established,'.
                    'last_deed,province_id,regency_id,district_id,village,address,postal_code',
                    'principal.province:id,code,name',
                    'principal.regency:id,code,name',
                    'principal.district:id,code,name',
                    'principal.documents:id,principal_id,name,url',
                    'blank',
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
                    'supportDocs:id,submission_id,name,number,date,url',
                    'staff:id,head_id,profile_id',
                ])->find($submissionId);
            $principal = $submission->getRelation('principal');
            $blank = $submission->getRelation('blank');
            $guarantor = $submission->getRelation('guarantor');
            $guarantorBranch = $submission->getRelation('guarantorBranch');
            $product = $submission->getRelation('product');
            $guarantorToProductType = $submission->getRelation('guarantorToProductType');
            $obligee = $submission->getRelation('obligee');
            $jobProvince = $submission->getRelation('province');
            $jobRegency = $submission->getRelation('regency');
            $jobDistrict = $submission->getRelation('district');
            $sourceOfFound = $submission->getRelation('sourceOfFund');
            $submissionDocs = $submission->getRelation('submissionDocs')->whereNotNull('format_document')->values();
            $submissionDocsFile = $submission->getRelation('submissionDocs')->whereNull('format_document')->values();
            $submissionBeforeId = $submission->getAttribute('submission_before_id');

            $hostToHost = $guarantor->getRelation('hostToHost');
            $url = $hostToHost->getAttribute('guarantor_url_host');
            $url = $submissionBeforeId ? $url.'/endorsement' : $url.'/submission';
            $prefix = $hostToHost->getAttribute('auth_prefix');
            $token = ($prefix ? $prefix.' ' : '').$hostToHost->getAttribute('token');

            $dataSend = ['submission_id' => $submission->getAttribute('id')];
            if ($submissionBeforeId) {
                $submissionCallback = SubmissionCallback::query()->firstWhere('submission_id', $submissionBeforeId);
                if (! $submissionCallback) {
                    Log::error('Submission failed to send to guarantor', [
                        'submission_id' => $submissionId,
                        'status' => 'error',
                        'message' => 'Pengajuan sebelumnya belum mendapatkan persetujuan dari asuransi',
                    ]);

                    return $this->responseError('Gagal mengirimkan data ke pihak asuransi', [
                        'status' => 'error',
                        'message' => 'Pengajuan sebelumnya belum mendapatkan persetujuan dari asuransi',
                    ]);
                }
                $submissionFirst = Submission::query()
                  ->where(function ($query) {
                    $query->where('status', SubmissionStatus::APPROVED->value)
                      ->orWhere('status', SubmissionStatus::REVISED->value);
                  })
                  ->where('has_send_to_guarantor', true)
                  ->orderBy('created_at')
                  ->firstWhere('no_guarantee', $submission->getAttribute('no_guarantee'));
                $dataSend = [
                    'submission_id' => $submissionFirst->getAttribute('id'),
                    'remarks' => $submission->getAttribute('revised_note'),
                    'policyno' => $submissionCallback->getAttribute('no_policy'),
                ];
            }
            $docsPrincipal = $principal->getRelation('documents')->map(function ($doc) {
                return [
                    'name' => $doc->getAttribute('name'),
                    'url' => $doc->getAttribute('url'),
                ];
            })->toArray();
            $supportDocs = $submission->getRelation('supportDocs')->map(function ($doc) {
                return [
                    'name' => $doc->getAttribute('name').', '.$doc->getAttribute('number').', '.$doc->getAttribute('date'),
                    'url' => $doc->getAttribute('url'),
                ];
            })->toArray();
            $finalOutputFile = $submissionDocsFile->map(function ($doc) {
                return [
                    'name' => $doc->getAttribute('name'),
                    'url' => $doc->getAttribute('url'),
                ];
            })->toArray();
            $docs = array_merge($docsPrincipal, $supportDocs, $finalOutputFile);
            $docSupport = $submission->getRelation('supportDocs')->first();

            $result = array_merge($dataSend, [
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
                    'docs' => $docs,
                ],
                'guarantee' => [
                    'no' => $submission->getAttribute('no_guarantee'),
                    'value' => $submission->getAttribute('guarantee_value'),
                ],
                'contract' => [
                    'blank' => $blank?->number,
                    'value' => $submission->getAttribute('contract_value'),
                    'document' => $docSupport ? [
                        'name' => $docSupport->getAttribute('name'),
                        'number' => $docSupport->getAttribute('number'),
                        'date' => $docSupport->getAttribute('date'),
                    ] : [
                        'name' => null,
                        'number' => null,
                        'date' => null,
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
                'final_output_file' => $finalOutputFile,
            ]);

            Log::info('Data Send To Assurance', $result);
            $final = $this->hostToHostService->sendPostRequest($url, $token, $result);
            if ($final['status'] === 'success') {
                $submission->update(['has_send_to_guarantor' => true]);
                Log::info('Submission sent to guarantor', ['submission_id' => $submissionId]);

                return $this->responseSuccess('Berhasil mengirimkan data ke pihak asuransi');
            }
            Log::error('Submission failed to send to guarantor', ['submission_id' => $submissionId, ...$final]);

            return $this->responseError('Gagal mengirimkan data ke pihak asuransi', $final);
        } catch (Exception $e) {
            $error = $this->handleErrorMessage($e);
            Log::error('Error sending submission to guarantor', $error);

            return $this->responseError('Gagal mengirimkan data ke pihak asuransi', [
                'status' => 'error',
                'message' => 'Gagal mengirimkan data ke pihak asuransi',
                'error' => $error,
            ]);
        }
    }
}
