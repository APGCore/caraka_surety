<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Submission\CallbackRequest;
use App\Models\Submission\SubmissionCallback;
use Exception;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\JsonResponse;

class SubmissionController extends Controller
{
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
            Log::error('Callback Error: ', ['message' => $e->getMessage()]);

            return $this->responseError('Terjadi Kesalahan Saat Mengirimkan data', $e->getMessage());
        }
    }
}
