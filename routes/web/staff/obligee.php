<?php

use App\Http\Controllers\RelatedParties\ObligeeController;
use Illuminate\Support\Facades\Route;

Route::prefix('obligee-management')->group(function () {
    Route::controller(ObligeeController::class)->prefix('obligee')
        ->name('staff-obligee-')->group(function () {
            Route::get('/all', 'getObligee')->name('get.all');
        });
});
