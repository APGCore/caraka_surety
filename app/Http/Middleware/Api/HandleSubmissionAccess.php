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
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $request->validate([
            'submission_id' => 'required|exists:'.Submission::class.',id',
            'token' => 'required|string',
        ]);
        $submissionId = $request->get('submission_id');
        $submission = Submission::query()->select(['id', 'guarantor_id'])->with(['guarantor:id', 'guarantor.hostToHost'])->find($submissionId);
        $hostToHost = $submission->getRelation('guarantor')->getRelation('hostToHost');
        if(($hostToHost->isNotEmpty() ? $hostToHost->getAttribute('token') : null) !== $request->get('token')) {
            return $this->responseError(message: ['message' => 'Token Salah'],code: 401);
        }
        $hostToHost->setAttribute('accessed_at', now());
        $hostToHost->save();

        return $next($request);
    }
}
