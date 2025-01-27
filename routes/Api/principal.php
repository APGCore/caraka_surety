<?php

use App\Http\Controllers\RelatedParties\PrincipalController;
use Illuminate\Support\Facades\Route;



Route::prefix('principal-management')
    ->name('api.principal-management.')
    ->group(function () {

        Route::controller(PrincipalController::class)
            ->prefix('principal')
            ->name('principal-management.principal.')
            ->group(function () {
                Route::get('all', 'getAll')->name('all');
                Route::get('document', 'getDocument')->name('documents');
                Route::get('ratios/{principalId}', 'getRatios')->name('ratios');
            });
    });
