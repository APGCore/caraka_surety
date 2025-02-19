<?php

use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Validation\ValidationException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->renderable(function (ValidationException $e, $request) {
            // if route API, return JSON response
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'data' => $e->errors(),
                ], 422);
            }

            // if route WEB, return Inertia response
            // error message will be displayed in the form
            $errors = collect($e->errors())->pluck(0)->toArray();
            flashMessage('Failed', implode(', ', $errors), 'error');

            return redirect()->back()->withInput($errors)->withErrors($errors);
        });

        $exceptions->renderable(function (AuthenticationException $e, $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Unauthorized',
                ], 401);
            }

            return redirect()->route('login');
        });
    })->create();
