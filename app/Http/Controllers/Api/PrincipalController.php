<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Principal\StoreRequest;
use App\Http\Requests\Principal\UpdateRequest;
use App\Http\Requests\Principal\UploadDocumentRequest;
use App\Http\Resources\Principal\PrincipalDocumentResource;
use App\Http\Resources\Principal\PrincipalResource;
use App\Models\Document\RequiredDoc;
use App\Models\RelatedParties\Principal;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PrincipalController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $requestValid = $request->validated();
            $principal = Principal::query()->create($requestValid);
            activity()
                ->useLog('principal')
                ->performedOn($principal)
                ->causedBy(auth()->user())
                ->log('Menambahkan data principal');
            DB::commit();

            return $this->responseSuccess('Data Principal Berhasil Ditambahkan', new PrincipalResource($principal));
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('PrincipalController@store: ', $error);

            return $this->responseError('Data Principal Gagal Ditambahkan', $error);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Principal $principal): JsonResponse
    {
        try {
            DB::beginTransaction();

            $requestValid = $request->validated();
            $principal->update($requestValid);
            activity()
                ->useLog('principal')
                ->performedOn($principal)
                ->causedBy(auth()->user())
                ->log('Mengubah data principal');
            DB::commit();

            return $this->responseSuccess('Data Principal Berhasil Diubah', new PrincipalResource($principal));
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('PrincipalController@update: ', $error);

            return $this->responseError('Data Principal Gagal Diubah', $error);
        }
    }

    public function getAll(): JsonResponse
    {
        $principals = Principal::query()
            ->with(['documents'])
            ->get();

        return $this->responseSuccess('Data Principal', $principals);
    }

    public function getDocument(Request $request): JsonResponse
    {
        $request->validate([
            'principal_id' => 'nullable|exists:'.Principal::class.',id,deleted_at,NULL',
        ]);

        $requiredDocuments = RequiredDoc::with(['principalDocument' => function ($query) use ($request) {
            $query->where([
                'principal_id' => $request->get('principal_id'),
                'is_approved' => true,
            ]);
        }])->get();

        $resource = PrincipalDocumentResource::collection($requiredDocuments);

        return $this->responseSuccess('Berhasil Mengambil Dokumen Principal', $resource);
    }

    public function getRatios(Principal $principal): JsonResponse
    {
        $principal->load('principalRatios');

        $ratios = $principal->getRelation('principalRatios')->take(2) ?? [];

        return $this->responseSuccess('Data Ratio', $ratios);
    }

    public function uploadDocument(UploadDocumentRequest $request, Principal $principal): JsonResponse
    {
        try {
            DB::beginTransaction();
            $principal->load('documents');
            $requestValid = $request->validated();
            $requiredDocId = $requestValid['required_doc_id'];
            // Delete existing document if exists
            $existingDocument = $principal->documents()->firstWhere('required_doc_id', $requiredDocId);

            if ($existingDocument && $existingDocument->url) {
                $this->deleteFile($existingDocument->url);
            }
            $file = $requestValid['file'];
            $requiredDoc = RequiredDoc::query()->firstWhere('id', $requiredDocId);

            $principalName = $principal->getAttribute('name')
              ? str_replace(' ', '_', $principal->getAttribute('name'))
              : 'principal';
            $path = "principal/{$principal->getAttribute('id')}-{$principalName}/documents";

            $url = $this->uploadFile(
                $file,
                $path,
                $requiredDoc->name
            );
            $document = collect([
                'required_doc_id' => $requiredDocId,
                'name' => $requiredDoc->name,
                'is_approved' => true,
                'url' => $url,
            ]);

            $principal->documents()->updateOrCreate([
                'required_doc_id' => $requiredDocId,
            ], $document->toArray());

            DB::commit();

            return $this->responseSuccess('Dokumen berhasil diunggah', $document);
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('PrincipalController@uploadDocument: ', $error);

            return $this->responseError('Gagal mengunggah dokumen', $error);
        }
    }
}
