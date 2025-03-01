<?php

use App\Http\Controllers\RelatedParties\ObligeeController;
use Illuminate\Support\Facades\Route;

Route::prefix('obligee-management')
    ->name('api.obligee-management.')
    ->group(function () {

        Route::controller(ObligeeController::class)
            ->prefix('obligee')
            ->name('obligee.')
            ->group(function () {

                // api.obligee-management.obligee.all
                Route::get('/all', 'getObligee')->name('all');
            });
    });
