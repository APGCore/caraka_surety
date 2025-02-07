<?php

use App\Enums\RoleEnum;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    // Check if the user is authenticated
    if (! Auth::check()) {
        return redirect()->route('login'); // Redirect to login if not authenticated
    }
    $user = User::query()->find(Auth::id());
    $roleEnums = RoleEnum::getRoute() ?? [];

    $role = $user?->role->name;

    if ($role !== null && array_key_exists($role, $roleEnums)) {
        $route = $roleEnums[$role];
    } else {
        $route = 'login';
    }

    return redirect()->intended(route($route, absolute: false));
});
