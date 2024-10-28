<?php

use App\Http\Controllers\Scorings\ScoringController;
use Illuminate\Support\Facades\Route;

Route::prefix('scoring-management')->group(function () {
    Route::controller(ScoringController::class)
        ->name('staff-scoring-')
        ->group(function () {
            Route::get('/all', 'getAllScoring')->name('get.all');
            Route::get('{scoring}', 'getScoringById')->name('get.byId');
        });
});
