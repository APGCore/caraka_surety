<?php

use App\Http\Controllers\Api\PrincipalController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::prefix('principal-management')
        ->name('api.principal-management.')
        ->group(function () {
            Route::controller(PrincipalController::class)
                ->group(function () {
                    Route::prefix('principal')
                        ->name('principal.')
                        ->group(function () {
                            // NAME: api.principal-management.principal.all
                            // PATH: /principal-management/principal/all
                            Route::get('all', 'getAll')->name('all');

                            // NAME: api.principal-management.principal.ratios
                            // PATH: /principal-management/principal/ratios/{principal}
                            Route::get('ratios/{principal}', 'getRatios')->name('ratios');

                            // NAME: api.principal-management.principal.store
                            // PATH: /principal-management/principal/store
                            Route::post('store', 'store')->name('store');

                            // NAME: api.principal-management.principal.update
                            // PATH: /principal-management/principal/update/{principal}
                            Route::put('update/{principal}', 'update')->name('update');
                        });

                    Route::prefix('document')
                        ->name('document.')
                        ->group(function () {
                            // NAME: api.principal-management.document.upload
                            // PATH: /principal-management/document/uploads/{principal}
                            Route::post('uploads/{principal}', 'uploadDocument')->name('upload');
                            // NAME: api.principal-management.document.delete
                            // PATH: /principal-management/document/delete/{document}
                            Route::delete('delete/{document}', 'deleteDocument')->name('delete');
                        });
                });
        });
});
