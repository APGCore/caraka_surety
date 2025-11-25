<?php

use App\Http\Controllers\Api\SubmissionController;
use Illuminate\Support\Facades\Route;

Route::controller(SubmissionController::class)
    ->prefix('submission')
    ->group(function () {
        Route::post('callback', 'getCallback')->name('get-callback');
    });
