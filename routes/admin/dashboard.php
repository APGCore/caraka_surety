<?php

use App\Http\Controllers;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/', Controllers\DashboardAdminController::class)
        ->name('admin.index');
});
