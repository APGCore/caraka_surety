<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::controller(UserController::class)
    ->prefix('user-management')
    ->name('api.user-management.')
    ->group(function () {
        Route::get('roles', 'getApiRoles')->name('roles');
    });
