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
            $url = $this->uploadFile($fileData, 'submission/callback', $submissionId . '-image-from-guarantor');

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

    public function postToGetCallback(Request $request): JsonResponse
    {
        $submissionId = $request->get('submission_id');
        $submission = Submission::query()
            ->with(['guarantor', 'guarantor.hostToHost'])
            ->find($submissionId);
        $guarantor = $submission->getRelation('guarantor');
        $hostToHost = $guarantor->getRelation('hostToHost');
//        $url = $hostToHost->getAttribute('guarantor_url_host')
        $url = 'https://api.jastan.co.id/v1/bond/action/submission/status';
        $prefix = $hostToHost->getAttribute('auth_prefix');
//        $token = ($prefix ? $prefix.' ' : '').$hostToHost->getAttribute('token');
        $token = 'token 03f7b0b2fbf076fec3f55b8d19615316';

        $result = $this->hostToHostService->sendPostRequest($url, $token, ['submission_id' => $submissionId]);

        if ($result['status'] === 'success') {
            $data = $result['message'];
            // image is base64
            $imageString = $data['image'];
            // base64 to file
            $fileData = $this->base64ToFile($imageString);
            // save image to storage
            $url = $this->uploadFile($fileData, 'submission/callback', $submissionId . '-image-from-guarantor');
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

            Log::info('Callback Success: ', $data);

            return $this->responseSuccess('Berhasil Mengambil Data', $data);
        } else {
            Log::error('Error Callback: ', ['message' => $result['message']]);

            return $this->responseError('Terjadi Kesalahan Saat Mengambil Data', $result['message']);
        }
    }
}
