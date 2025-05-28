<?php

use App\Http\Controllers\MonitoringController;
use Illuminate\Support\Facades\Route;

Route::controller(MonitoringController::class)
    ->prefix('monitoring')->name('monitoring.')
    ->group(function () {
        Route::prefix('submission')
            ->name('submission')->group(function () {
                Route::get('/', 'submission')->name('.index');
                Route::get('/{submission}', 'submissionDetail')->name('.detail');
            });
    });
