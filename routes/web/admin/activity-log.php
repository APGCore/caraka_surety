<?php

use App\Http\Controllers\ActivityLogController;
use Illuminate\Support\Facades\Route;

Route::prefix('activity-log-management')
    ->group(function () {
        Route::controller(ActivityLogController::class)
            ->prefix('activity-log')
            ->name('activity-log.')
            ->group(function () {
                // activity-log.index
                Route::get('/', 'index')->name('index');
            });
    });
