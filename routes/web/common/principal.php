<?php

use App\Http\Controllers\RelatedParties\PrincipalController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')
    ->prefix('references')->name('references.')
    ->group(function () {
        // references.principal.*
        Route::controller(PrincipalController::class)->prefix('principal')
            ->name('principal.')->group(function () {
                Route::get('all', 'getAll')->name('all');
                Route::get('document', 'getDocument')->name('documents');
                Route::get('getRatios/{principalId}', 'getRatios')->name('ratios');
            });
    });
