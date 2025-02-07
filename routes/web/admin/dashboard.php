<?php

use App\Enums\RoleEnum;
use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::get('/', Controllers\DashboardAdminController::class)
    ->name(RoleEnum::AdminRoute->value);
