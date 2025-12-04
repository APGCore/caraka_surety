<?php

namespace App\Http\Middleware\Api;

use App\Traits\ResponseFormat;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleAccess
{
    use ResponseFormat;

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiPrivateKey = config('services.api.private_key');
        $requestKey = $request->header('X-API-KEY');
        if ($requestKey !== $apiPrivateKey) {
            return $this->responseError(message: ['message' => 'Unauthorized'], code: 401);
        }

        return $next($request);
    }
}
