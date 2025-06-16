<?php

namespace App\Http\Middleware\Api;

use App\Models\Guarantor\Guarantor;
use App\Traits\ResponseFormat;
use Closure;
use Illuminate\Http\Request;

class GetFileByTokenGuarantorMiddleware
{
    use ResponseFormat;

    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('Authorization');
        if (! $token) {
            return $this->responseError(message: ['message' => 'Token Tidak Ditemukan'], code: 401);
        }
        $guarantors = Guarantor::whereHas('hostToHost', function ($query) use ($token) {
            $query->where('token', $token);
        })->first();
        if (! $guarantors) {
            return $this->responseError(message: ['message' => 'Token Salah'], code: 401);
        }

        return $next($request);
    }
}
