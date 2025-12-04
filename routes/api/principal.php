<?php

use App\Http\Controllers\Api\PrincipalController;
use App\Http\Middleware\Api\HandleAccess;
use Illuminate\Support\Facades\Route;

Route::controller(PrincipalController::class)
    ->middleware(HandleAccess::class)
    ->prefix('principal')
    ->group(function () {
        Route::post('get', 'search')->name('get-principals');
        Route::post('store', 'store')->name('store-principals');
        Route::post('update/{principal}', 'update')->name('update-principals');
        Route::post('upload-document', 'updateDocumentExt')->name('update-principal-docs');
    });
