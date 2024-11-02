<?php

use App\Http\Controllers\RelatedParties\PrincipalController;
use Illuminate\Support\Facades\Route;


Route::prefix('references')->name('references.')->group(function () {

    // references.principal.*
    Route::controller(PrincipalController::class)->prefix('principal')
        ->name('principal.')->group(function () {
            Route::get('all', 'getAll')->name('all');
        });
});
