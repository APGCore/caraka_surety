<?php

use App\Http\Controllers\MonitoringController;
use Illuminate\Support\Facades\Route;

Route::controller(MonitoringController::class)
    ->prefix('monitoring')->name('monitoring.')
    ->group(function () {
        Route::prefix('principal')
            ->name('principal')->group(function () {
                Route::get('/', 'principal')->name('.index');
                Route::get('/{principal}', 'principalDetail')->name('.detail');
            });
    });
