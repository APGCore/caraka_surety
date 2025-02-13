<?php

use App\Http\Controllers\Scorings\ScoringController;
use Illuminate\Support\Facades\Route;

Route::prefix('scoring-management')
    ->name('api.scoring-management.')
    ->group(function () {

        Route::controller(ScoringController::class)
            ->prefix('scoring')
            ->name('scoring.')
            ->group(function () {
                Route::get('/all', 'getAllScoring')->name('all');
                Route::get('{scoring}', 'getScoringById')->name('get-by-id');
            });
    });

// api.scoring-management.scoring.get-by-id
