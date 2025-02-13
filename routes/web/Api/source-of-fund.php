<?php

use App\Http\Controllers\Submission\SourceOfFundController;
use Illuminate\Support\Facades\Route;

Route::prefix('source-of-fund-management')
    ->name('api.source-of-fund.')
    ->group(function () {

        Route::controller(SourceOfFundController::class)
            ->prefix('source-of-fund')
            ->name('source-of-fund.')
            ->group(function () {
                Route::get('all', 'getAll')->name('all');
            });
    });
