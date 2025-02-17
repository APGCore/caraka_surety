<?php

use App\Http\Controllers\Api\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::controller(SubmissionController::class)
    ->middleware('auth:sanctum')
    ->prefix('submission')->name('submission.')
    ->group(function () {
        Route::get('{submission}', 'show')->name('show');
        Route::post('callback', 'callback')->name('callback');
    });
