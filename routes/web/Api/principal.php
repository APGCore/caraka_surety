<?php

use App\Http\Controllers\Api\PrincipalController;
use Illuminate\Support\Facades\Route;

Route::prefix('principal-management')
    ->name('api.principal-management.')
    ->group(function () {
        Route::controller(PrincipalController::class)
            ->group(function () {
                Route::prefix('principal')
                    ->name('principal.')
                    ->group(function () {
                        // api.principal-management.principal.all
                        Route::get('all', 'getAll')->name('all');
                        // api.principal-management.principal.documents
                        Route::get('document', 'getDocument')->name('documents');
                        // api.principal-management.principal.ratios
                        Route::get('ratios/{principal}', 'getRatios')->name('ratios');
                        // api.principal-management.principal.store
                        Route::post('store', 'store')->name('store');
                        // api.principal-management.principal.update
                        Route::put('update/{principal}', 'update')->name('update');
                    });


                Route::prefix('document')
                    ->name('document.')
                    ->group(function () {
                        // api.principal-management.document.upload
                        Route::get('upload/{principal}', 'uploadDocument')->name('upload');
                    });
            });
    });
