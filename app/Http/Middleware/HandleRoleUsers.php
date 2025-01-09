<?php

namespace App\Http\Middleware;

use App\Enums\RoleEnum;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleRoleUsers
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (! auth()->user()->hasRoles($roles)) {
            $role = User::query()->find(auth()->id())?->role;
            $route = RoleEnum::getRoute()[$role];

            return redirect()->route($route);
        }

        return $next($request);
    }
}
