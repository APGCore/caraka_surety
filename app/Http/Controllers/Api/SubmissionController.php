<?php

namespace App\Http\Controllers\Api;

use App\Enums\OfficeType;
use App\Enums\SubmissionStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Submission\CallbackExtRequest;
use App\Http\Requests\Api\Submission\CallbackRequest;
use App\Http\Requests\Api\Submission\SaveDocSignatureRequest;
use App\Http\Requests\Api\Submission\SetBlankRequest;
use App\Http\Requests\Api\Submission\StoreDocumentRequest;
use App\Http\Requests\Api\Submission\UpdateDocumentRequest;
use App\Models\Document\DocumentFormat;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use App\Models\Profile\Profile;
use App\Models\RelatedParties\Principal;
use App\Models\Submission\Submission;
use App\Models\Submission\SubmissionCallback;
use App\Models\Submission\SubmissionDoc;
use App\Services\HostToHostService;
use App\Traits\GeneratePattern;
use App\Traits\ReplaceDocumentFormat;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class SubmissionController extends Controller
{
    use GeneratePattern, ReplaceDocumentFormat;

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

        // $submission = Submission::query()
        //     ->where(function ($query) {
        //         $query->where('status', SubmissionStatus::APPROVED->value)
        //             ->orWhere('status', SubmissionStatus::REVISED->value);
        //     })
        //     ->where('has_send_to_guarantor', true)
        //     ->orderBy('created_at')
        //     ->with(['guarantor', 'guarantor.hostToHost'])
        //     ->firstWhere('id', $submissionFirst->getAttribute('id'));

        $query = Submission::query()
            ->where(function ($query) {
                $query->whereIn('status', [
                    SubmissionStatus::APPROVED->value,
                    SubmissionStatus::REVISED->value,
                ]);
            })
            ->where('has_send_to_guarantor', true)
            ->orderBy('created_at')
            ->with(['guarantor', 'guarantor.hostToHost']);

        if ($submissionFirst->getAttribute('no_guarantee') != 'XXXXXXXXXXXXXXXX') {
            // 🔁 Revisi → cari berdasarkan no_guarantee
            $query->where('no_guarantee', $submissionFirst->getAttribute('no_guarantee'));
        } else {
            // 🆕 Pertama kali → pakai ID
            $query->where('id', $submissionFirst->getAttribute('id'));
        }
        $submission = $query->first();

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
            // NOTE: sudah tidak digunakan untuk menyimpan data, simpan data ada di method @getCallback, karena untuk memastikan data yang disimpan sudah final dari pihak asuransi, bukan data sementara yang dikirim saat callback
            // $imageString = $data['image'] ?? null;
            // if ($imageString) {
            //     // base64 to file
            //     $fileData = $this->base64ToFile($imageString);
            //     // save image to storage
            //     $url = $this->uploadFile($fileData, 'submission/callback', $submissionId.'-image-from-guarantor');
            //     $submission->update(['has_send_to_guarantor' => true]);
            //     SubmissionCallback::query()->updateOrCreate(
            //         ['submission_id' => $submissionId],
            //         [
            //             'submission_id' => $submissionId,
            //             'doc_url' => $data['doc_url'] ?? '-',
            //             'url' => $url,
            //             'no_policy' => $data['policyno'],
            //         ]
            //     );
            //     Submission::query()->find($submissionId)->update(['no_guarantee' => $data['policyno']]);
            // }

            // cek response kosong
            if (empty($result) || $result === 'Empty Response') {
                Log::error('Callback Error: Empty response from third party', [
                    'submission_id' => $submissionId,
                    'response' => $result,
                ]);

                return $this->responseError('Error Dari Asuransi: Tidak ada data response dari Asuransi');
            }

            if (isset($data['error'])) {
                Log::error('Error Callback: ', $data['error']);

                $message = $data['error']['message'] ? 'Error Dari Asuransi: '.$data['error']['message'] : 'Data Belum Diterima Dari Asuransi';

                return $this->responseError($message, $data['error']);
            }

            Log::info('Callback Success: ', $data);

            return $this->responseSuccess('Berhasil Mengambil Data Callback', $data);
        } else {
            Log::error('Error Callback: ', $result);

            return $this->responseError('Terjadi Kesalahan Saat Mengambil Data Callback');
        }
    }

    /**
     * @throws Exception
     */
    public function getCallback(CallbackExtRequest $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $submissionId = $request->get('submission_id');
            $docUrl = $request->get('doc_url');
            $image = $request->get('image');
            $noPolis = $request->get('no_policy');

            if ($image) {
                $fileData = $this->base64ToFile($image);
                $submission = Submission::query()
                    ->where('id', $submissionId)
                    ->first(['id', 'status', 'no_guarantee']);
                // chack submission is revised or approved
                if ($submission->getAttribute('status') == SubmissionStatus::REVISED->value) {
                    $submission = Submission::query()
                        ->where('status', SubmissionStatus::APPROVED->value)
                        ->where('no_guarantee', $noPolis)
                        ->first(['id']);

                    Log::info('Callback processed to new submission revision', [
                        'message' => 'New submission revision created',
                        'old_submission_id' => $submissionId,
                        'revision_submission_id' => $submission->getAttribute('id'),
                        'no_polis' => $noPolis,
                    ]);
                }
                $submissionFirstId = $submission->getAttribute('id');
                // save image to storage
                $url = $this->uploadFile($fileData, 'submission/callback', $submissionId.'-image-from-guarantor');
                SubmissionCallback::query()->updateOrCreate(
                    ['submission_id' => $submissionFirstId],
                    [
                        'doc_url' => $docUrl ?? '-',
                        'url' => $url,
                        'no_policy' => $noPolis,
                    ]
                );
                Submission::query()->find($submissionId)->update(['no_guarantee' => $noPolis]);
            } else {
                Log::error('Document file is missing in the request', ['no_polis' => $noPolis]);

                throw new Exception('File dokumen tidak ditemukan dalam permintaan');
            }

            Log::info('Callback processed successfully', [
                'no_polis' => $noPolis,
            ]);
            DB::commit();

            return $this->responseSuccess('Berhasil mengirim hasil pengajuan');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to process callback', $error);

            return $this->responseError('Gagal memproses callback', $error);
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

            return $this->responseSuccess('Berhasil mengubah Dokumen Luaran');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to update document format', $error);

            return $this->responseError('Gagal mengubah Dokumen Luaran', $error);
        }
    }

    public function selectDocumentFormat(Request $request): JsonResponse
    {
        try {
            $submissionId = $request->input('submission_id');
            $documentFormatId = $request->input('document_format_id');

            $submission = Submission::findOrFail($submissionId);
            $submission->update(['selected_document_format_id' => $documentFormatId]);

            return $this->responseSuccess('Dokumen jaminan berhasil dipilih');
        } catch (Exception $e) {
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to select document format', $error);

            return $this->responseError('Gagal memilih dokumen jaminan', $error);
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
                    'guarantorBranch',
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
                    'submissionBefore:id',
                    'submissionBefore.callback',
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
            $submissionDocsFile = $submission->getRelation('submissionDocs')->whereNull('format_document')->values();
            $submissionBefore = $submission->getRelation('submissionBefore');

            $hostToHost = $guarantor->getRelation('hostToHost');
            $url = $hostToHost->getAttribute('guarantor_url_host');
            $url = $submissionBefore ? $url.'/endorsement' : $url.'/submission';
            $prefix = $hostToHost->getAttribute('auth_prefix');
            $token = ($prefix ? $prefix.' ' : '').$hostToHost->getAttribute('token');

            $dataSend = ['submission_id' => $submission->getAttribute('id')];
            if ($submissionBefore) {
                $submissionCallback = $submissionBefore->getRelation('callback');
                // if (! $submissionCallback) {
                //    Log::error('Submission failed to send to guarantor', [
                //        'submission_id' => $submissionId,
                //        'status' => 'error',
                //        'message' => 'Pengajuan sebelumnya belum mendapatkan persetujuan dari asuransi',
                //    ]);

                //    return $this->responseError('Gagal mengirimkan data ke pihak asuransi', [
                //        'status' => 'error',
                //        'message' => 'Pengajuan sebelumnya belum mendapatkan persetujuan dari asuransi',
                //    ]);
                // }
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

            $documentFormats = DocumentFormat::query()
                ->whereNull(['guarantor_id', 'product_id', 'guarantor_to_product_type_id', 'bank_id'])
                ->orWhere(function ($query) use ($submission) {
                    $query->where('guarantor_id', $submission->getAttribute('guarantor_id'))
                        ->where('product_id', $submission->getAttribute('product_id'))
                        ->where(function ($query) use ($submission) {
                            $query->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
                                ->orWhereNull('guarantor_to_product_type_id');
                        })
                        ->whereNull('bank_id'); // tambahin filter bank_id kosong
                })
                ->orWhere(function ($query) use ($submission) {
                    $query->where('guarantor_id', $submission->getAttribute('guarantor_id'))
                        ->whereNull('product_id')
                        ->whereNull('guarantor_to_product_type_id')
                        ->whereNull('bank_id');
                })
                ->orderBy('no')
                ->get();

            $submissionDocs = collect();
            $submissionConverted = $this->convertSubmission($submission);

            // Get existing submission_docs to check for edited specimen (no=4)
            $existingSubmissionDocs = $submission->submissionDocs()
                ->with('documentFormat:id,no')
                ->get()
                ->keyBy('document_format_id');

            // Get the selected specimen doc (no=4) — prefer DB column, fallback to first existing
            $selectedSpecimenDocFormatId = $submission->getAttribute('selected_document_format_id');
            if (! $selectedSpecimenDocFormatId) {
                $selectedSpecimenDoc = $existingSubmissionDocs->first(function ($doc) {
                    return $doc->documentFormat && (int) $doc->documentFormat->getAttribute('no') === 4;
                });
                $selectedSpecimenDocFormatId = $selectedSpecimenDoc?->getAttribute('document_format_id');
            }

            foreach ($documentFormats as $documentFormat) {
                $docFormatId = $documentFormat->getAttribute('id');
                $docNo = (int) $documentFormat->getAttribute('no');

                // For specimen (no=4), only process the selected one
                if ($docNo === 4) {
                    // Skip if this is not the selected specimen doc
                    if ($selectedSpecimenDocFormatId && $docFormatId !== $selectedSpecimenDocFormatId) {
                        continue;
                    }
                    // If no specimen selected yet, only take the first one
                    if (! $selectedSpecimenDocFormatId) {
                        $selectedSpecimenDocFormatId = $docFormatId;
                    }
                }

                // For specimen (no=4), preserve edited content if exists
                $existingDoc = $existingSubmissionDocs->get($docFormatId);
                if ($docNo === 4 && $existingDoc && $existingDoc->getAttribute('format_document')) {
                    $formatDocument = $existingDoc->getAttribute('format_document');
                } else {
                    $formatDocument = $this->replaceDocumentFormat($documentFormat, $submissionConverted);
                }

                // For specimen (no=4), rename to standard name "Jaminan Penawaran" from "Jaminan Penawaran Pokja"
                $docName = $documentFormat->getAttribute('name');
                if ($docNo === 4 && $docName === 'Jaminan Penawaran Pokja') {
                    $docName = 'Jaminan Penawaran';
                }
                if ($docNo === 4 && $docName === 'Jaminan Penawaran Pokja II') {
                    $docName = 'Jaminan Penawaran';
                }

                $submissionDoc = [
                    'name' => $docName,
                    'format_document' => $formatDocument,
                ];
                $submission->submissionDocs()->updateOrCreate(
                    [
                        'submission_id' => $submission->getAttribute('id'),
                        'document_format_id' => $docFormatId,
                    ],
                    $submissionDoc
                );
                $submissionDocs->push($submissionDoc);
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
                    'publication_date' => $submission->getAttribute('publication_date'),
                ],
                'output' => $submissionDocs->map(fn ($doc) => [
                    'name' => $doc['name'],
                    'value' => $doc['format_document'],
                ])->toArray(),
                'final_output_file' => $finalOutputFile,
            ]);

            Log::info('Data Send To Assurance', $result);
            $final = $this->hostToHostService->sendPostRequest($url, $token, $result);
            if ($final['status'] === 'success') {
                $submission->update([
                    'has_send_to_guarantor' => true,
                    'send_to_guarantor_at' => now(),
                ]);
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

    public function downloadSpecimenPdf(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $content = $request->input('content');
            $submissionId = $request->input('submission_id');
            $documentFormatId = $request->input('document_format_id');
            $principalId = $request->input('principal_id');

            Log::info('Specimen PDF request received', [
                'submission_id' => $submissionId,
                'document_format_id' => $documentFormatId,
                'content_length' => strlen($content ?? ''),
            ]);

            if (! $content) {
                Log::error('Specimen PDF: Content is empty');

                return $this->responseError('Content dokumen tidak boleh kosong');
            }

            $submission = Submission::query()
                ->with(['guarantor.hostToHost'])
                ->find($submissionId);

            if (! $submission) {
                Log::error('Specimen PDF: Submission not found', ['submission_id' => $submissionId]);

                return $this->responseError('Pengajuan tidak ditemukan');
            }

            $guarantorBranch = Guarantor::query()
                ->select(['id', 'code', 'name'])
                ->find($submission['guarantor_branch_id']);
            if (! $guarantorBranch) {
                Log::error('Specimen PDF: Guarantor branch not found', [
                    'submission_id' => $submissionId,
                    'guarantor_branch_id' => $submission['guarantor_branch_id'],
                ]);

                return $this->responseError('Cabang penjamin tidak ditemukan');
            }

            $principal = Principal::query()
                ->select(['id', 'name', 'director_position', 'director_name'])
                ->find($principalId);

            // Find document format by ID if provided, otherwise fallback to no=4 query
            if ($documentFormatId) {
                $specimenDocFormat = DocumentFormat::query()->find($documentFormatId);
            } else {
                $specimenDocFormat = DocumentFormat::query()
                    ->where('no', 4)
                    ->where(function ($query) use ($submission) {
                        $query->where(function ($q) use ($submission) {
                            $q->where('guarantor_id', $submission->getAttribute('guarantor_id'))
                                ->where('product_id', $submission->getAttribute('product_id'));
                        })->orWhereNull('guarantor_id');
                    })
                    ->orderByDesc('guarantor_id')
                    ->first();
            }

            // Save edited content to submission_docs (preserve for later use)
            if ($specimenDocFormat) {
                // Delete all existing specimen docs (no=4) for this submission first
                // This ensures only one specimen doc exists at a time
                SubmissionDoc::query()
                    ->where('submission_id', $submissionId)
                    ->whereHas('documentFormat', function ($query) {
                        $query->where('no', 4);
                    })
                    ->delete();

                // Create new submission doc for the selected specimen
                SubmissionDoc::query()->create([
                    'submission_id' => $submissionId,
                    'document_format_id' => $specimenDocFormat->getAttribute('id'),
                    'name' => $specimenDocFormat->getAttribute('name'),
                    'format_document' => $content,
                ]);
                Log::info('Specimen content saved to submission_docs', [
                    'submission_id' => $submissionId,
                    'document_format_id' => $specimenDocFormat->getAttribute('id'),
                ]);
            }

            $guarantor = $submission->getRelation('guarantor');

            if (! $guarantor) {
                Log::error('Specimen PDF: Guarantor not found', ['submission_id' => $submissionId]);

                return $this->responseError('Guarantor tidak ditemukan');
            }

            $hostToHost = $guarantor->getRelation('hostToHost');

            if (! $hostToHost) {
                Log::error('Specimen PDF: Host to host config not found', [
                    'submission_id' => $submissionId,
                    'guarantor_id' => $guarantor->getAttribute('id'),
                ]);

                return $this->responseError('Konfigurasi host to host tidak ditemukan');
            }

            $url = $hostToHost->getAttribute('guarantor_url_host').'/speciment';
            $prefix = $hostToHost->getAttribute('auth_prefix');
            $token = ($prefix ? $prefix.' ' : '').$hostToHost->getAttribute('token');

            Log::info('Calling third-party API for specimen PDF', [
                'submission_id' => $submissionId,
                'url' => $url,
            ]);

            $payload = [
                'branch_code' => $guarantorBranch->getAttribute('code'),
                'principal_name' => $principal->getAttribute('name'),
                'pic' => $principal->getAttribute('director_name'),
                'position' => $principal->getAttribute('director_position'),
                'content' => $content,
            ];

            $response = Http::withHeaders([
                'Authorization' => $token,
                'Content-Type' => 'application/json',
            ])->post($url, $payload);

            if (! $response->successful()) {
                Log::error('Failed to download specimen PDF from third-party API', [
                    'submission_id' => $submissionId,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return $this->responseError('Gagal mengunduh specimen PDF dari asuransi: '.$response->status());
            }

            $pdfContent = $response->body();
            $fileName = 'specimen_'.$submissionId.'_'.date('Ymd_His').'.pdf';
            $path = "submission/specimen/{$submissionId}";
            $fullPath = $path.'/'.$fileName;

            $disk = Storage::disk(config('filesystems.default'));
            $stored = $disk->put($fullPath, $pdfContent);

            if (! $stored) {
                throw new Exception('Gagal menyimpan file PDF ke storage');
            }

            $submission->update(['specimen_pdf_path' => $fullPath]);

            DB::commit();

            Log::info('Specimen PDF downloaded and saved', [
                'submission_id' => $submissionId,
                'path' => $fullPath,
            ]);

            return $this->responseSuccess('Berhasil mengunduh dan menyimpan specimen PDF', [
                'path' => $fullPath,
                'url' => $disk->url($fullPath),
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to download specimen PDF', $error);

            return $this->responseError('Gagal mengunduh specimen PDF', $error);
        }
    }

    public function getSpecimenPdf($submissionId): JsonResponse|StreamedResponse
    {
        try {
            $submission = Submission::query()->find($submissionId);

            if (! $submission) {
                return $this->responseError('Pengajuan tidak ditemukan');
            }

            $specimenPath = $submission->getAttribute('specimen_pdf_path');

            if (! $specimenPath) {
                return $this->responseError('Specimen PDF belum tersedia');
            }

            $disk = Storage::disk(config('filesystems.default'));

            if (! $disk->exists($specimenPath)) {
                return $this->responseError('File specimen PDF tidak ditemukan');
            }

            return $disk->download($specimenPath, 'specimen_'.$submissionId.'.pdf');
        } catch (Exception $e) {
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to get specimen PDF', $error);

            return $this->responseError('Gagal mengambil specimen PDF', $error);
        }
    }

    public function previewSpecimenPdf($submissionId): JsonResponse|\Illuminate\Http\Response
    {
        try {
            $submission = Submission::query()->find($submissionId);

            if (! $submission) {
                return $this->responseError('Pengajuan tidak ditemukan');
            }

            $specimenPath = $submission->getAttribute('specimen_pdf_path');

            if (! $specimenPath) {
                return $this->responseError('Specimen PDF belum tersedia');
            }

            $disk = Storage::disk(config('filesystems.default'));

            if (! $disk->exists($specimenPath)) {
                return $this->responseError('File specimen PDF tidak ditemukan');
            }

            return response($disk->get($specimenPath), 200, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="specimen_'.$submissionId.'.pdf"',
            ]);
        } catch (Exception $e) {
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to preview specimen PDF', $error);

            return $this->responseError('Gagal menampilkan specimen PDF', $error);
        }
    }

    public function resetSpecimenToDefault(Request $request): JsonResponse
    {
        DB::beginTransaction();
        try {
            $submissionId = $request->input('submission_id');
            $documentFormatId = $request->input('document_format_id');

            $submission = Submission::query()->find($submissionId);

            if (! $submission) {
                return $this->responseError('Pengajuan tidak ditemukan');
            }

            // Find document format by ID if provided, otherwise fallback to no=4 query
            if ($documentFormatId) {
                $specimenDocFormat = DocumentFormat::query()->find($documentFormatId);
            } else {
                $specimenDocFormat = DocumentFormat::query()
                    ->where('no', 4)
                    ->where(function ($query) use ($submission) {
                        $query->where(function ($q) use ($submission) {
                            $q->where('guarantor_id', $submission->getAttribute('guarantor_id'))
                                ->where('product_id', $submission->getAttribute('product_id'));
                        })->orWhereNull('guarantor_id');
                    })
                    ->orderByDesc('guarantor_id')
                    ->first();
            }

            if (! $specimenDocFormat) {
                return $this->responseError('Document format specimen tidak ditemukan');
            }

            // Delete the saved specimen from submission_docs
            SubmissionDoc::query()
                ->where('submission_id', $submissionId)
                ->where('document_format_id', $specimenDocFormat->getAttribute('id'))
                ->delete();

            // Also delete the specimen PDF file if exists
            $specimenPath = $submission->getAttribute('specimen_pdf_path');
            if ($specimenPath) {
                $disk = Storage::disk(config('filesystems.default'));
                if ($disk->exists($specimenPath)) {
                    $disk->delete($specimenPath);
                }
                $submission->update(['specimen_pdf_path' => null]);
            }

            DB::commit();

            Log::info('Specimen reset to default', ['submission_id' => $submissionId]);

            // Get fresh format_document with variable replacements
            $submissionConverted = $this->convertSubmission($submission);
            $processedFormatDocument = $this->replaceDocumentFormat($specimenDocFormat, $submissionConverted);

            return $this->responseSuccess('Specimen berhasil direset ke default', [
                'format_document' => $processedFormatDocument,
                'document_format_id' => $specimenDocFormat->getAttribute('id'),
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Failed to reset specimen to default', $error);

            return $this->responseError('Gagal mereset specimen ke default', $error);
        }
    }
}
