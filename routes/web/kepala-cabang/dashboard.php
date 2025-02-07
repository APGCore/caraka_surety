<?php

use App\Enums\RoleEnum;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/', [DashboardController::class, 'dashboardKepalaCabang'])->name(RoleEnum::KepalaCabangRoute->value);
});
