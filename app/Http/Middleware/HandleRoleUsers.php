<?php

namespace App\Http\Middleware;

use App\Enums\RoleEnum;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        $user = User::query()->find(Auth::id());


        if (!$user?->hasRoles($roles)) {
            $role = $user->role?->name;

            $roleEnums = RoleEnum::getRoute() ?? [];

            if ($role !== null && array_key_exists($role, $roleEnums)) {
                $route = $roleEnums[$role];

                return redirect()->route($route);
            }
        }

        return $next($request);
    }
}
