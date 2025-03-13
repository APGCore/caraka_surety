<?php

namespace App\Http\Middleware\Api;

use App\Models\Submission\Submission;
use App\Traits\ResponseFormat;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleSubmissionAccess
{
    use ResponseFormat;

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $request->validate([
            'submission_id' => 'required|exists:'.Submission::class.',id',
        ]);
        $token = $request->header('token');
        if (! $token) {
            return $this->responseError(message: ['message' => 'Token Tidak Ditemukan'], code: 401);
        }
        $submissionId = $request->get('submission_id');
        $submission = Submission::query()->select(['id', 'guarantor_id'])->with(['guarantor:id', 'guarantor.hostToHost'])->find($submissionId);
        $hostToHost = $submission->getRelation('guarantor')->getRelation('hostToHost');
        if (($hostToHost ? $hostToHost->getAttribute('token') : null) !== $token) {
            return $this->responseError(message: ['message' => 'Token Salah'], code: 401);
        }
        $hostToHost->setAttribute('accessed_at', now());
        $hostToHost->save();

        return $next($request);
    }
}
