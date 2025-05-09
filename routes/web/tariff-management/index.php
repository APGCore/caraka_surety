<?php

use App\Enums\RoleEnum;
use App\Http\Middleware\HandleRoleUsers;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', HandleRoleUsers::class.':'.implode(',', [RoleEnum::Admin->value, RoleEnum::Finance->value])])
    ->prefix('tariff-management')
    ->group(function () {
        foreach (glob(__DIR__.'/*.php') as $file) {
            require_once $file;
        }
    });
