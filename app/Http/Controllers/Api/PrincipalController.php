<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Principal\StoreRequest;
use App\Http\Requests\Principal\UpdateRequest;
use App\Http\Requests\Principal\UploadDocumentExtRequest;
use App\Http\Requests\Principal\UploadDocumentRequest;
use App\Http\Resources\Principal\PrincipalResource;
use App\Models\Document\RequiredDoc;
use App\Models\RelatedParties\Principal;
use App\Models\RelatedParties\PrincipalDocument;
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

    public function search(Request $request): JsonResponse
    {
        $search = $request->get('search') ?? '';
        $notInIds = $request->get('not_in_ids') ?? [];
        $principals = Principal::query()
            ->where('name', 'like', "%$search%")
            ->when(! empty($notInIds), function ($query) use ($notInIds) {
                $query->whereNotIn('id', $notInIds);
            })
            ->with(['documents.requiredDoc:id,code', 'province:id,code', 'regency:id,code', 'district:id,code'])
            ->limit(10)
            ->get();

        return $this->responseSuccess('Data Principal', $principals);
    }

    public function getAll(): JsonResponse
    {
        $principals = Principal::query()
            ->with(['documents'])
            ->get();

        return $this->responseSuccess('Data Principal', $principals);
    }
    //    public function getAll(): JsonResponse
    //    {
    //        $principals = SubmissionPrincipal::query()
    //            ->with(['documents'])
    //            ->get();
    //
    //        return $this->responseSuccess('Data Principal', $principals);
    //    }

    public function getRatios(Principal $principal): JsonResponse
    {
        $principal->load('principalRatios');

        $ratios = $principal->getRelation('principalRatios') ?? [];

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
            $path = "principal/{$principal->getAttribute('id')}-$principalName/documents";

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

    public function deleteDocument(PrincipalDocument $document): JsonResponse
    {
        try {
            DB::beginTransaction();

            $document->delete();

            activity()
                ->useLog('principal_document')
                ->performedOn($document)
                ->causedBy(auth()->user())
                ->log('Menghapus dokumen principal');
            flashMessage('Dokumen Principal Dihapus', 'Dokumen Principal dihapus');
            DB::commit();

            return $this->responseSuccess('Dokumen Principal Berhasil Dihapus');
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Dokumen Principal', 'Terjadi kesalahan saat menghapus dokumen principal', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('PrincipalController@deleteDocument: ', $error);

            return $this->responseError('Gagal menghapus dokumen', $error);
        }
    }

    public function updateDocumentExt(UploadDocumentExtRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $principalId = $request->get('principal_id');
            $requiredDocCode = $request->get('required_doc_code');
            $requiredDoc = RequiredDoc::query()->firstWhere('code', $requiredDocCode);
            $url = $request->get('url');

            PrincipalDocument::query()
                ->updateOrCreate([
                    'principal_id' => $principalId,
                    'required_doc_id' => function () use ($requiredDoc) {
                        return $requiredDoc ? $requiredDoc->getAttribute('id') : null;
                    },
                ], [
                    'name' => $requiredDoc ? $requiredDoc->getAttribute('name') : 'Dokumen Perusahaan',
                    'is_approved' => true,
                    'url' => $url,
          ]);

            DB::commit();

            return $this->responseSuccess('Dokumen berhasil diperbarui');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('PrincipalController@updateDocumentExt: ', $error);

            return $this->responseError('Gagal memperbarui dokumen', $error);
        }
    }
}
