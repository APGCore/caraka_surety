<?php

use App\Http\Controllers\Api\PrincipalController;
use Illuminate\Support\Facades\Route;

Route::prefix('principal-management')
    ->name('api.principal-management.')
    ->group(function () {
        Route::controller(PrincipalController::class)
            ->group(function () {
                Route::prefix('principal')
                    ->name('principal.')->group(function () {
                        Route::get('all', 'getAll')->name('all');
                        Route::get('document', 'getDocument')->name('documents');
                        Route::get('ratios/{principal}', 'getRatios')->name('ratios');
                    });

                Route::prefix('document')->name('document.')->group(function () {
                    Route::post('store', 'store')->name('store');
                    Route::put('update/{principal}', 'update')->name('update');
                });
            });
    });
