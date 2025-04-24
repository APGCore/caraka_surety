<?php

use App\Http\Controllers\ActivityLogController;
use Illuminate\Support\Facades\Route;

Route::prefix('log-activity-management')
    ->name('api.log-activity-management.')
    ->group(function () {

        Route::controller(ActivityLogController::class)
            ->prefix('activity-log')
            ->name('activity-log.')->group(function () {

                // NAME: api.log-activity-management.activity-log.search-activity-log
                // PATH: /api/log-activity-management/activity-log/search-activity-log
                Route::get('search-activity-log', 'apiSearch')->name('search-activity-log');
            });
    });
