<?php

use App\Enums\RoleEnum;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DashboardController::class, 'dashboardDireksi'])->name(RoleEnum::DireksiRoute->value);
