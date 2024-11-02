<?php

use App\Http\Controllers\Submission\SourceOfFundController;
use Illuminate\Support\Facades\Route;

// references.source-of-funds.all
Route::prefix('references')->name('references.')->group(function () {
    Route::controller(SourceOfFundController::class)->prefix('source-of-funds')
        ->name('source-of-funds.')->group(function () {
            Route::get('all', 'getAll')->name('all');
        });
});
