<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Response;

class CustomCsrfCookie
{
  /**
   * Handle an incoming request.
   *
   * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
   */
  public function handle(Request $request, Closure $next): Response
  {
    $response = $next($request);

    $cookieName = config('session.csrf_cookie', 'XSRF-TOKEN');

    Cookie::queue(
      Cookie::make(
        $cookieName,
        $request->session()->token(),
        120,
        '/',
        config('session.domain'),
        config('session.secure'),
        false,
        false,
        config('session.same_site')
      )
    );

    return $response;
  }
}
